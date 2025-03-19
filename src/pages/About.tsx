import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-bg text-text min-h-screen p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{t('about', 'About This App')}</h1>
      </header>
      <main className="max-w-4xl mx-auto">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{t('attributions', 'Attributions')}</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>React:</strong> <a className="underline" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">https://reactjs.org</a>
            </li>
            <li>
              <strong>React Router:</strong> <a className="underline" href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">https://reactrouter.com</a>
            </li>
            <li>
              <strong>i18next:</strong> <a className="underline" href="https://www.i18next.com" target="_blank" rel="noopener noreferrer">https://www.i18next.com</a>
            </li>
            <li>
              <strong>Tailwind CSS:</strong> <a className="underline" href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">https://tailwindcss.com</a>
            </li>
            <li>
              <strong>Vite:</strong> <a className="underline" href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">https://vitejs.dev</a>
            </li>
            <li>
              <strong>Playwright:</strong> <a className="underline" href="https://playwright.dev" target="_blank" rel="noopener noreferrer">https://playwright.dev</a>
            </li>
            <li>
              <strong>GitHub:</strong> <a className="underline" href="https://github.com" target="_blank" rel="noopener noreferrer">https://github.com</a>
            </li>
          </ul>
        </section>
        <section>
          <p>
            {t('attribution_message', 'This application was built with care using modern frameworks and tools. We are grateful to the open source community and all contributors for providing the resources that made this project possible.')}
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
