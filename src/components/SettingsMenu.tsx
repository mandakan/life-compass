import React, { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '@context/ThemeContext';
import ToggleSwitch from '@components/ToggleSwitch';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { removeUserData, clearAllUserData } from '@utils/storageService';

interface SettingsMenuProps {
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } =
    useContext(ThemeContext);
  const { showDevTools, setShowDevTools } = useContext(AppSettingsContext);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleThemeToggle = (checked: boolean) => {
    if (checked && theme !== 'dark') {
      toggleTheme();
    }
    if (!checked && theme !== 'light') {
      toggleTheme();
    }
  };

  const handleFollowSystemToggle = (checked: boolean) => {
    setFollowSystem(checked);
  };

  const handleDevToolsToggle = (checked: boolean) => {
    setShowDevTools(checked);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        typeof onClose === 'function'
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleReplayTutorial = () => {
    removeUserData('tutorialCompleted');
    onClose();
    navigate('/create-life-compass');
    window.location.reload();
  };

  const handleDeleteLocalData = () => {
    clearAllUserData()
  }

  return (
    <div
      className="bg-[var(--color-bg)] p-4 text-[var(--color-text)]"
      ref={menuRef}
    >
      <h2 className="mb-4 text-lg font-bold">{t('settings')}</h2>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('language') || 'Language'}</span>
          <LanguageSwitcher />
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('dark_mode')}</span>
          <ToggleSwitch
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('follow_system_theme', { system: systemTheme })}</span>
          <ToggleSwitch
            checked={followSystem}
            onChange={handleFollowSystemToggle}
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('show_dev_tools')}</span>
          <ToggleSwitch
            checked={showDevTools}
            onChange={handleDevToolsToggle}
          />
        </label>
      </div>
      <div className="mt-4">
        <button
          onClick={handleReplayTutorial}
          className="w-full rounded bg-[var(--color-primary)] px-3 py-2 text-[var(--on-primary)] focus:ring focus:outline-none"
          aria-label="Replay onboarding tutorial"
        >
          {t('replay_onboarding', 'Replay Onboarding Tutorial')}
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={handleDeleteLocalData}
          className="w-full rounded bg-[var(--color-accent)] px-3 py-2 text-[var(--on-primary)] focus:ring focus:outline-none"
          aria-label="Delete local data"
        >
          {t('delete_local_data', 'Delete local data')}
        </button>
      </div>
    </div>
  );
};

export default SettingsMenu;
