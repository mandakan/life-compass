import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentPage from '@components/ui/ContentPage';

interface Attribution {
  name: string;
  license: string;
  href: string;
  label: string;
}

const About: React.FC = () => {
  const { t } = useTranslation();

  const tools: Attribution[] = [
    {
      name: 'GitHub',
      license: 'Proprietary / Various',
      href: 'https://github.com',
      label: 'https://github.com',
    },
    {
      name: 'Aider',
      license: 'Apache License 2.0',
      href: 'https://aider.chat',
      label: 'https://aider.chat',
    },
    {
      name: 'ChatGPT',
      license: 'Proprietary',
      href: 'https://chat.openai.com',
      label: 'https://chat.openai.com',
    },
    {
      name: 'Playwright',
      license: 'Apache License 2.0',
      href: 'https://playwright.dev',
      label: 'https://playwright.dev',
    },
  ];

  const frameworks: Attribution[] = [
    {
      name: 'React',
      license: 'MIT License',
      href: 'https://reactjs.org',
      label: 'https://reactjs.org',
    },
    {
      name: 'React Router',
      license: 'MIT License',
      href: 'https://reactrouter.com',
      label: 'https://reactrouter.com',
    },
    {
      name: 'i18next',
      license: 'MIT License',
      href: 'https://www.i18next.com',
      label: 'https://www.i18next.com',
    },
    {
      name: 'Tailwind CSS',
      license: 'MIT License',
      href: 'https://tailwindcss.com',
      label: 'https://tailwindcss.com',
    },
    {
      name: 'Vite',
      license: 'MIT License',
      href: 'https://vitejs.dev',
      label: 'https://vitejs.dev',
    },
    {
      name: 'Heroicons',
      license: 'MIT License',
      href: 'https://heroicons.com',
      label: 'https://heroicons.com',
    },
    {
      name: 'Radix UI',
      license: 'MIT License',
      href: 'https://www.radix-ui.com',
      label: 'https://www.radix-ui.com',
    },
  ];

  const renderList = (items: Attribution[]) => (
    <ul className="space-y-2 text-text">
      {items.map(item => (
        <li key={item.name}>
          <strong>{item.name}:</strong> {item.license} -{' '}
          <a
            className="underline"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <ContentPage title={t('about', 'About This App')}>
      <div className="space-y-10">
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-text">
            {t('attributions', 'Attributions')}
          </h2>

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-text">
              {t('method', 'Method')}
            </h3>
            <ul className="space-y-2 text-text">
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

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-text">
              {t('tools', 'Tools')}
            </h3>
            {renderList(tools)}
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-text">
              {t('frameworksLibraries', 'Frameworks/Libraries')}
            </h3>
            {renderList(frameworks)}
          </div>
        </section>

        <section>
          <p className="text-lg leading-relaxed text-text-muted">
            {t(
              'attribution_message',
              'This application was built with care using modern frameworks and tools. We are grateful to the open source community and all contributors for providing the resources that made this project possible.',
            )}
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default About;
