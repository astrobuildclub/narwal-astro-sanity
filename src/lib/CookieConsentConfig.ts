export const cookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },

    analytics: {
      services: {
        youtube: {
          label: 'Youtube Embed',
          onAccept: () => {
            (window as any).iframemanager().acceptService('youtube');
            try {
              (window as any).iframemanager().scan();
            } catch (e) {}
            document.dispatchEvent(
              new CustomEvent('consent:changed', {
                detail: { service: 'youtube', accepted: true },
              }),
            );
          },
          onReject: () => {
            (window as any).iframemanager().rejectService('youtube');
            try {
              (window as any).iframemanager().scan();
            } catch (e) {}
            document.dispatchEvent(
              new CustomEvent('consent:changed', {
                detail: { service: 'youtube', accepted: false },
              }),
            );
          },
        },
        vimeo: {
          label: 'Vimeo Embed',
          onAccept: () => {
            (window as any).iframemanager().acceptService('vimeo');
            try {
              (window as any).iframemanager().scan();
            } catch (e) {}
            document.dispatchEvent(
              new CustomEvent('consent:changed', {
                detail: { service: 'vimeo', accepted: true },
              }),
            );
          },
          onReject: () => {
            (window as any).iframemanager().rejectService('vimeo');
            try {
              (window as any).iframemanager().scan();
            } catch (e) {}
            document.dispatchEvent(
              new CustomEvent('consent:changed', {
                detail: { service: 'vimeo', accepted: false },
              }),
            );
          },
        },
      },
    },

    ads: {},
  },

  language: {
    default: 'en',
    translations: {
      nl: {
        consentModal: {
          label: 'Cookie Toestemming',
          title: 'Hallo bezoeker, het is cookie tijd!',
          description:
            'Onze website gebruikt essentiële cookies om de juiste werking te garanderen en tracking cookies om te begrijpen hoe je ermee omgaat. De laatste worden alleen ingesteld na toestemming.',
          acceptAllBtn: 'Alles accepteren',
          closeIconLabel: 'Alles weigeren en sluiten',
          acceptNecessaryBtn: 'Alles weigeren',
          showPreferencesBtn: 'Voorkeuren beheren',
          footer:
            '<a href="#privacy">Privacybeleid</a><a href="#terms">Algemene voorwaarden</a>',
        },
        preferencesModal: {
          title: 'Toestemming voorkeuren centrum',
          acceptAllBtn: 'Alles accepteren',
          acceptNecessaryBtn: 'Alles weigeren',
          savePreferencesBtn: 'Voorkeuren opslaan',
          closeIconLabel: 'Modal sluiten',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'Iemand zei ... cookies?',
              description:
                'We gebruiken cookies om je ervaring op onze website te verbeteren en om te begrijpen hoe je onze website gebruikt.',
            },
            {
              title:
                'Strikt noodzakelijke cookies <span class="pm__badge">Altijd ingeschakeld</span>',
              description:
                'Deze cookies zijn noodzakelijk voor de werking van de website en kunnen niet worden uitgeschakeld in onze systemen.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytische cookies',
              description:
                'Deze cookies helpen ons te begrijpen hoe bezoekers de website gebruiken door informatie anoniem te verzamelen en te rapporteren.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Cookie',
                  Service: 'Service',
                  description: 'Beschrijving',
                },
                body: [
                  {
                    name: 'im_youtube',
                    description:
                      'Gebruikt om te onthouden of de gebruiker de youtube service heeft geaccepteerd.',
                    Service: 'Youtube Embed',
                  },
                  {
                    name: 'im_vimeo',
                    description:
                      'Gebruikt om te onthouden of de gebruiker de vimeo service heeft geaccepteerd.',
                    Service: 'Vimeo Embed',
                  },
                ],
              },
            },
            {
              title: 'Advertentie cookies',
              description:
                'Deze cookies worden gebruikt om advertenties te tonen die relevant zijn voor jou en je interesses.',
              linkedCategory: 'ads',
            },
            {
              title: 'Meer informatie',
              description:
                'Voor vragen over ons cookiebeleid en jouw keuzes, <a class="cc__link" href="#contact">neem contact met ons op</a>.',
            },
          ],
        },
      },
      en: {
        consentModal: {
          label: 'Cookie Preferences',
          title: "Let's talk cookies",
          description:
            'We use essential cookies to keep things running smoothly, and optional tracking cookies to understand how you use our site. The optional ones only get set with your consent.',
          acceptAllBtn: 'Accept all',
          closeIconLabel: 'Close and reject all',
          acceptNecessaryBtn: 'Necessary only',
          showPreferencesBtn: 'Customize',
          footer:
            '<a href="#privacy">Privacy Policy</a><a href="#terms">Terms</a>',
        },
        preferencesModal: {
          title: 'Cookie Preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Necessary only',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              title: 'About these cookies',
              description:
                'We use cookies to make our site work better and to understand how you use it. Simple as that.',
            },
            {
              title:
                'Essential cookies <span class="pm__badge">Always on</span>',
              description:
                "These cookies are essential for the site to function. We can't turn them off, and neither can you.",
              linkedCategory: 'necessary',
            },
            {
              title: 'Analytics cookies',
              description:
                'These help us understand how visitors use our site by collecting anonymous information.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Cookie',
                  Service: 'Service',
                  description: 'What it does',
                },
                body: [
                  {
                    name: 'im_youtube',
                    description:
                      "Remembers if you've accepted YouTube embeds on this site.",
                    Service: 'Youtube Embed',
                  },
                  {
                    name: 'im_vimeo',
                    description:
                      "Remembers if you've accepted Vimeo embeds on this site.",
                    Service: 'Vimeo Embed',
                  },
                ],
              },
            },
            {
              title: 'Advertising cookies',
              description:
                'These cookies help us show you ads that are relevant to your interests.',
              linkedCategory: 'ads',
            },
            {
              title: 'Questions?',
              description:
                'Got questions about our cookie policy? <a class="cc__link" href="#contact">Get in touch</a>.',
            },
          ],
        },
      },
    },
  },
};
