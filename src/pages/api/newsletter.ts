import type { APIRoute } from 'astro';
import { loadEnv } from 'vite';

export const prerender = false;

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

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse Mailchimp response:', parseError);
      const text = await response.text();
      console.error('Mailchimp response text:', text);
      return {
        success: false,
        message: 'Er is een fout opgetreden bij het verwerken van de response.',
      };
    }

    console.log('Mailchimp API response:', { status: response.status, data });

    if (!response.ok) {
      // Handle Mailchimp specific errors
      const error = data as MailchimpError;
      console.error('Mailchimp API error:', { status: response.status, error });
      
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

      // Generic error with more details in dev
      const errorMessage = import.meta.env.DEV && error.detail 
        ? `Er is een fout opgetreden: ${error.detail}`
        : 'Er is een fout opgetreden. Probeer het later opnieuw.';
      
      return {
        success: false,
        message: errorMessage,
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

export const POST: APIRoute = async ({ request }) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Method not allowed',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }

  try {
    // Get environment variables
    // Load env vars using Vite's loadEnv for consistency
    const env = loadEnv(import.meta.env.MODE || 'development', process.cwd(), '');
    let apiKey = env.MAILCHIMP_API_KEY || process.env.MAILCHIMP_API_KEY || import.meta.env.MAILCHIMP_API_KEY;
    let listId = env.MAILCHIMP_LIST_ID || process.env.MAILCHIMP_LIST_ID || import.meta.env.MAILCHIMP_LIST_ID;
    
    // Remove quotes if present (common in .env files)
    if (apiKey) apiKey = apiKey.replace(/^["']|["']$/g, '');
    if (listId) listId = listId.replace(/^["']|["']$/g, '');

    console.log('Environment check:', { 
      hasApiKey: !!apiKey, 
      hasListId: !!listId,
      apiKeyLength: apiKey?.length || 0,
      listIdLength: listId?.length || 0,
      apiKeyStart: apiKey?.substring(0, 10) || 'none',
      listId: listId || 'none'
    });

    if (!apiKey || !listId) {
      console.error('Missing Mailchimp environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Server configuratie fout. Neem contact op met de beheerder.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Parse request body
    let body: NewsletterRequestBody;
    try {
      body = await request.json();
      console.log('Received request body:', body);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Ongeldige aanvraag data.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate email
    if (!body.email || !isValidEmail(body.email)) {
      console.log('Email validation failed:', { email: body.email, isValid: body.email ? isValidEmail(body.email) : false });
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Gelieve een geldig email adres in te voeren.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Add to Mailchimp
    const result = await addToMailchimp(
      body.email.trim(),
      body.name,
      apiKey,
      listId
    );

    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
