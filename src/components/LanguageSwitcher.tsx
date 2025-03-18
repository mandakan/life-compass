import React, { useState, useEffect, useRef } from 'react';
import i18next from 'i18next';

interface Language {
  code: string;
  name: string;
  verified: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', verified: false },
  { code: 'sv', name: 'Svenska', verified: true },
  { code: 'nl', name: 'Nederlands', verified: false },
  { code: 'de', name: 'Deutsch', verified: false },
  { code: 'da', name: 'Dansk', verified: false },
  { code: 'nb', name: 'Norsk Bokmål', verified: false },
];

const LanguageSwitcher: React.FC = () => {
  // Normalize the detected language to its language code (e.g., en-GB -> en)
  const detectedLang = i18next.language ? i18next.language.split('-')[0] : 'en';
  const storedLang = localStorage.getItem('selectedLanguage');
  const initialLang =
    storedLang && languages.some(lang => lang.code === storedLang)
      ? storedLang
      : languages.some(lang => lang.code === detectedLang)
        ? detectedLang
        : 'en';

  const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLang);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Validate selectedLanguage; if it's not supported, default to 'en'
    if (!languages.some(lang => lang.code === selectedLanguage)) {
      setSelectedLanguage('en');
      localStorage.setItem('selectedLanguage', 'en');
      i18next.changeLanguage('en');
    } else {
      i18next.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('selectedLanguage', code);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectedLangObj = languages.find(
    lang => lang.code === selectedLanguage,
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        id="language-switcher"
        className="inline-flex w-full min-w-max justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-[var(--hover-bg)] focus:outline-none"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--border)',
          color: 'var(--color-text)',
          zIndex: 50,
        }}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        onClick={toggleDropdown}
      >
        {selectedLangObj ? selectedLangObj.name : selectedLanguage}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <ul
          className="absolute z-10 mt-2 rounded-md py-1 text-base shadow-lg focus:outline-none"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--border)',
            width: 'auto',
            minWidth: buttonRef.current
              ? `${buttonRef.current.offsetWidth}px`
              : '100%',
          }}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={selectedLanguage}
        >
          {languages.map(lang => (
            <li
              key={lang.code}
              id={lang.code}
              data-lang={lang.code}
              role="option"
              aria-selected={selectedLanguage === lang.code}
              className={`relative cursor-pointer py-2 pr-9 pl-3 text-sm select-none ${
                selectedLanguage === lang.code
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--color-text)]'
              } hover:bg-[var(--hover-bg)]`}
              onClick={() => handleLanguageSelect(lang.code)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleLanguageSelect(lang.code);
                }
              }}
              tabIndex={0}
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal">
                  {lang.name}
                  {!lang.verified && (
                    <span
                      className="ml-1"
                      title="This language is not verified"
                    >
                      ⚠
                    </span>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
