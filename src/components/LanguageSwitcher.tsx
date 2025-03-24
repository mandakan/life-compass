import React, { useEffect, useState } from 'react';
import i18next from '@/lib/i18n';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import Button from '@components/ui/Button';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface Language {
  code: string;
  name: string;
  verified: boolean;
}

interface LanguageSwitcherProps {
  compact?: boolean;
  testId?: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', verified: false },
  { code: 'sv', name: 'Svenska', verified: true },
  { code: 'nl', name: 'Nederlands', verified: false },
  { code: 'de', name: 'Deutsch', verified: false },
  { code: 'da', name: 'Dansk', verified: false },
  { code: 'nb', name: 'Norsk Bokmål', verified: false },
  { code: 'tlh', name: 'tlhIngan Hol', verified: false },
];

const flagMap: Record<string, string> = {
  en: '🇬🇧',
  sv: '🇸🇪',
  nl: '🇳🇱',
  de: '🇩🇪',
  da: '🇩🇰',
  nb: '🇳🇴',
  tlh: '🖖',
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact, testId }) => {
  const detectedLang = i18next.language?.split('-')[0] ?? 'en';
  const storedLang = localStorage.getItem('selectedLanguage');
  const initialLang =
    storedLang && languages.some(lang => lang.code === storedLang)
      ? storedLang
      : languages.some(lang => lang.code === detectedLang)
        ? detectedLang
        : 'en';

  const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

  useEffect(() => {
    if (!languages.some(lang => lang.code === selectedLanguage)) {
      setSelectedLanguage('en');
      localStorage.setItem('selectedLanguage', 'en');
      i18next.changeLanguage('en');
    } else {
      i18next.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const syncLang = (lng: string) => setSelectedLanguage(lng);
    i18next.on('languageChanged', syncLang);
    return () => {
      i18next.off('languageChanged', syncLang);
    };
  }, []);

  const selectedLang = languages.find(l => l.code === selectedLanguage);
  const displayLabel = compact
    ? flagMap[selectedLanguage] || selectedLanguage.toUpperCase()
    : (selectedLang?.name ?? selectedLanguage);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-testid={testId || 'language-switcher'}
          id="language-switcher"
          variant="ghost"
          className="flex items-center gap-2 border border-[var(--border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--hover-bg)]"
        >
          {displayLabel}
          {!compact && <ChevronDownIcon className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 w-52 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-1 shadow-lg"
        align="start"
      >
        <ul className="space-y-1">
          {languages.map(lang => (
            <li key={lang.code}>
              <button
                role="option"
                aria-selected={selectedLanguage === lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  localStorage.setItem('selectedLanguage', lang.code);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] focus:outline-none ${
                  selectedLanguage === lang.code
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--color-text)]'
                }`}
              >
                {`${flagMap[lang.code] ?? lang.code.toUpperCase()} - ${lang.name}`}
                {!lang.verified && <span className="ml-1">⚠</span>}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
