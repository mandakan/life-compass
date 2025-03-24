import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg text-text h-full p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{t('about', 'About This App')}</h1>
      </header>
      <main className="mx-auto max-w-4xl">
        <section className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">
            {t('attributions', 'Attributions')}
          </h2>
          <div className="mb-4">
            <h3 className="mb-2 text-xl font-semibold">
              {t('method', 'Method')}
            </h3>
            <ul className="list-inside list-disc">
              <li>
                <strong>KBT Primarvården:</strong>{' '}
                <a
                  className="underline"
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-NC-SA 4.0
                </a>{' '}
                -{' '}
                <a
                  className="underline"
                  href="https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-varderingar/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://kbtiprimarvarden.se/
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 text-xl font-semibold">
              {t('tools', 'Tools')}
            </h3>
            <ul className="list-inside list-disc">
              <li>
                <strong>GitHub:</strong> Proprietary / Various -{' '}
                <a
                  className="underline"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com
                </a>
              </li>
              <li>
                <strong>Aider:</strong> Apache License 2.0 -{' '}
                <a
                  className="underline"
                  href="https://aider.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://aider.chat
                </a>
              </li>
              <li>
                <strong>ChatGPT:</strong> Proprietary -{' '}
                <a
                  className="underline"
                  href="https://chat.openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://chat.openai.com
                </a>
              </li>
              <li>
                <strong>Playwright:</strong> Apache License 2.0 -{' '}
                <a
                  className="underline"
                  href="https://playwright.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://playwright.dev
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              {t('frameworksLibraries', 'Frameworks/Libraries')}
            </h3>
            <ul className="list-inside list-disc">
              <li>
                <strong>React:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://reactjs.org
                </a>
              </li>
              <li>
                <strong>React Router:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://reactrouter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://reactrouter.com
                </a>
              </li>
              <li>
                <strong>i18next:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://www.i18next.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.i18next.com
                </a>
              </li>
              <li>
                <strong>Tailwind CSS:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://tailwindcss.com
                </a>
              </li>
              <li>
                <strong>Vite:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://vitejs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://vitejs.dev
                </a>
              </li>
              <li>
                <strong>Heroicons:</strong> MIT License -{' '}
                <a
                  className="underline"
                  href="https://heroicons.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://heroicons.com
                </a>
              </li>
              <li>
                <strong>Radix UI:</strong> MIT License –{' '}
                <a
                  className="underline"
                  href="https://www.radix-ui.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.radix-ui.com
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section>
          <p>
            {t(
              'attribution_message',
              'This application was built with care using modern frameworks and tools. We are grateful to the open source community and all contributors for providing the resources that made this project possible.',
            )}
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
