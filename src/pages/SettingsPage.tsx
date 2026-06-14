import React, { useContext, useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { AppSettingsContext } from '@context/AppSettingsContext';
import ToggleSwitch from '@components/ui/ToggleSwitch';
import LanguageSwitcher from '@components/LanguageSwitcher';
import { ThemeSwitcher } from '@components/ui/ThemeSwitcher';
import Button from '@components/ui/Button';
import ContentPage from '@components/ui/ContentPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { clearAllUserData, removeUserData } from '@utils/storageService';
import WarningDialog from '@components/ui/WarningDialog';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => (
  <section className="space-y-3">
    <h2 className="font-display text-xl font-semibold text-text">{title}</h2>
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-warm-sm">
      {children}
    </div>
  </section>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex items-center justify-between gap-4">
    <span className="text-text">{label}</span>
    {children}
  </label>
);

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme, systemTheme, followSystem, setFollowSystem } =
    useTheme();
  const { showDevTools, setShowDevTools } = useContext(AppSettingsContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleThemeToggle = (checked: boolean) => {
    if (checked && theme !== 'dark') setTheme('dark');
    if (!checked && theme !== 'light') setTheme('light');
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
    // Full reset: clears the Life Compass store, snapshot history, and any
    // other local flags. Navigate home and reload so the in-memory store and
    // UI re-initialise empty rather than showing stale, already-deleted data.
    clearAllUserData();
    setShowDeleteModal(false);
    navigate('/');
    window.location.reload();
  };

  const handleDeleteCancel = () => setShowDeleteModal(false);

  return (
    <ContentPage title={t('settings')}>
      <WarningDialog
        visible={showDeleteModal}
        message={t('delete_local_data_warning')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <div className="space-y-8">
        <SettingsSection title={t('settings_appearance', 'Appearance')}>
          <SettingsRow label={t('dark_mode')}>
            <ToggleSwitch
              checked={theme === 'dark'}
              onChange={handleThemeToggle}
            />
          </SettingsRow>
          <SettingsRow label={t('theme.title')}>
            <ThemeSwitcher />
          </SettingsRow>
          <SettingsRow
            label={t('follow_system_theme', { system: systemTheme })}
          >
            <ToggleSwitch
              checked={followSystem}
              onChange={handleFollowSystemToggle}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title={t('settings_language', 'Language')}>
          <SettingsRow label={t('language')}>
            <LanguageSwitcher />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title={t('settings_data', 'Data')}>
          <SettingsRow label={t('show_dev_tools')}>
            <ToggleSwitch
              checked={showDevTools}
              onChange={handleDevToolsToggle}
            />
          </SettingsRow>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleReplayTutorial}
          >
            {t('replay_onboarding', 'Replay Onboarding Tutorial')}
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleDeleteLocalData}
          >
            {t('delete_local_data', 'Delete local data')}
          </Button>
        </SettingsSection>
      </div>
    </ContentPage>
  );
};

export default SettingsPage;
