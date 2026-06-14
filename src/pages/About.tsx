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
      name: 'Claude Code',
      license: 'Proprietary (Anthropic)',
      href: 'https://www.anthropic.com/claude-code',
      label: 'https://www.anthropic.com/claude-code',
    },
    {
      name: 'Aider',
      license: 'Apache License 2.0',
      href: 'https://aider.chat',
      label: 'https://aider.chat',
    },
    {
      name: 'Playwright',
      license: 'Apache License 2.0',
      href: 'https://playwright.dev',
      label: 'https://playwright.dev',
    },
    {
      name: 'Vitest',
      license: 'MIT License',
      href: 'https://vitest.dev',
      label: 'https://vitest.dev',
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
      name: 'TypeScript',
      license: 'Apache License 2.0',
      href: 'https://www.typescriptlang.org',
      label: 'https://www.typescriptlang.org',
    },
    {
      name: 'Zustand',
      license: 'MIT License',
      href: 'https://github.com/pmndrs/zustand',
      label: 'https://github.com/pmndrs/zustand',
    },
    {
      name: 'Recharts',
      license: 'MIT License',
      href: 'https://recharts.org',
      label: 'https://recharts.org',
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
    {
      name: 'Fraunces (font)',
      license: 'SIL Open Font License 1.1',
      href: 'https://fonts.google.com/specimen/Fraunces',
      label: 'Fraunces',
    },
    {
      name: 'Hanken Grotesk (font)',
      license: 'SIL Open Font License 1.1',
      href: 'https://fonts.google.com/specimen/Hanken+Grotesk',
      label: 'Hanken Grotesk',
    },
  ];

  const renderList = (items: Attribution[]) => (
    <ul className="text-text space-y-2">
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
          <h2 className="font-display text-text text-2xl font-semibold">
            {t('attributions', 'Attributions')}
          </h2>

          <div className="space-y-3">
            <h3 className="font-display text-text text-xl font-semibold">
              {t('method', 'Method')}
            </h3>
            <ul className="text-text space-y-2">
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
            <h3 className="font-display text-text text-xl font-semibold">
              {t('tools', 'Tools')}
            </h3>
            {renderList(tools)}
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-text text-xl font-semibold">
              {t('frameworksLibraries', 'Frameworks/Libraries')}
            </h3>
            {renderList(frameworks)}
          </div>
        </section>

        <section>
          <p className="text-text-muted text-lg leading-relaxed">
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
