import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface NewsletterRequestBody {
  email: string;
  name?: string;
}

interface MailchimpError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
}

/**
 * Extract datacenter from Mailchimp API key
 * Format: {key}-{datacenter} (e.g., "abc123-us9")
 */
function extractDatacenter(apiKey: string): string {
  const parts = apiKey.split('-');
  return parts[parts.length - 1] || 'us1';
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Add subscriber to Mailchimp list
 */
async function addToMailchimp(
  email: string,
  name: string | undefined,
  apiKey: string,
  listId: string
): Promise<{ success: boolean; message: string }> {
  const datacenter = extractDatacenter(apiKey);
  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`;

  const body: {
    email_address: string;
    status: string;
    merge_fields?: { FNAME?: string };
  } = {
    email_address: email,
    status: 'subscribed',
  };

  // Add name to merge fields if provided
  if (name && name.trim()) {
    body.merge_fields = {
      FNAME: name.trim(),
    };
  }

  try {
    // Mailchimp API v3 uses Basic Auth with API key as username
    const authString = Buffer.from(`apikey:${apiKey}`).toString('base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Mailchimp specific errors
      const error = data as MailchimpError;
      
      // Duplicate email (already subscribed)
      if (response.status === 400 && error.title === 'Member Exists') {
        return {
          success: false,
          message: 'Dit email adres is al geregistreerd in onze nieuwsbrief.',
        };
      }

      // Invalid email
      if (response.status === 400 && error.title === 'Invalid Resource') {
        return {
          success: false,
          message: 'Ongeldig email adres. Controleer je invoer en probeer het opnieuw.',
        };
      }

      // Generic error
      return {
        success: false,
        message: 'Er is een fout opgetreden. Probeer het later opnieuw.',
      };
    }

    return {
      success: true,
      message: 'Bedankt! Je bent succesvol aangemeld voor onze nieuwsbrief.',
    };
  } catch (error) {
    console.error('Mailchimp API error:', error);
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het verbinden met de server. Probeer het later opnieuw.',
    };
  }
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
    };
  }

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    // Get environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;

    if (!apiKey || !listId) {
      console.error('Missing Mailchimp environment variables');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Server configuratie fout. Neem contact op met de beheerder.',
        }),
      };
    }

    // Parse request body
    let body: NewsletterRequestBody;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Ongeldige aanvraag data.',
        }),
      };
    }

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Gelieve een geldig email adres in te voeren.',
        }),
      };
    }

    // Add to Mailchimp
    const result = await addToMailchimp(
      body.email.trim(),
      body.name,
      apiKey,
      listId
    );

    return {
      statusCode: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        message: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
      }),
    };
  }
};
