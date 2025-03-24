import React, { useContext, useState } from 'react';
import { ThemeContext } from '@context/ThemeContext';
import { AppSettingsContext } from '@context/AppSettingsContext';
import ToggleSwitch from '@components/ui/ToggleSwitch';
import LanguageSwitcher from '@components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { clearAllUserData, removeUserData } from '@utils/storageService';
import WarningDialog from '@components/ui/WarningDialog';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme, systemTheme, followSystem, setFollowSystem } =
    useContext(ThemeContext);
  const { showDevTools, setShowDevTools } = useContext(AppSettingsContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleThemeToggle = (checked: boolean) => {
    if (checked && theme !== 'dark') toggleTheme();
    if (!checked && theme !== 'light') toggleTheme();
  };

  const handleFollowSystemToggle = (checked: boolean) =>
    setFollowSystem(checked);

  const handleDevToolsToggle = (checked: boolean) => setShowDevTools(checked);

  const handleReplayTutorial = () => {
    removeUserData('tutorialCompleted');
    navigate('/create-life-compass');
    window.location.reload();
  };

  const handleDeleteLocalData = () => setShowDeleteModal(true);

  const handleDeleteConfirm = () => {
    clearAllUserData();
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => setShowDeleteModal(false);

  return (
    <div className="mx-auto max-w-xl p-6 font-sans text-[var(--color-text)]">
      <WarningDialog
        visible={showDeleteModal}
        message={t('delete_local_data_warning')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <h1 className="mb-6 text-2xl font-bold">{t('settings')}</h1>

      <section className="mb-6">
        <label className="flex items-center justify-between">
          <span>{t('language')}</span>
          <LanguageSwitcher />
        </label>
      </section>

      <section className="mb-6">
        <label className="flex items-center justify-between">
          <span>{t('dark_mode')}</span>
          <ToggleSwitch
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
          />
        </label>
      </section>

      <section className="mb-6">
        <label className="flex items-center justify-between">
          <span>{t('follow_system_theme', { system: systemTheme })}</span>
          <ToggleSwitch
            checked={followSystem}
            onChange={handleFollowSystemToggle}
          />
        </label>
      </section>

      <section className="mb-6">
        <label className="flex items-center justify-between">
          <span>{t('show_dev_tools')}</span>
          <ToggleSwitch
            checked={showDevTools}
            onChange={handleDevToolsToggle}
          />
        </label>
      </section>

      <section className="mb-6">
        <button
          onClick={handleReplayTutorial}
          className="w-full rounded bg-[var(--color-primary)] px-4 py-2 text-[var(--on-primary)] focus:ring"
        >
          {t('replay_onboarding', 'Replay Onboarding Tutorial')}
        </button>
      </section>

      <section>
        <button
          onClick={handleDeleteLocalData}
          className="w-full rounded bg-[var(--color-accent)] px-4 py-2 text-[var(--on-primary)] focus:ring"
        >
          {t('delete_local_data', 'Delete local data')}
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
