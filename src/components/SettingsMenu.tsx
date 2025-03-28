import React, { useContext, useEffect, useRef, useState } from 'react';
import ToggleSwitch from '@components/ui/ToggleSwitch';
import { AppSettingsContext } from '@context/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { removeUserData, clearAllUserData } from '@utils/storageService';
import WarningDialog from '@components/ui/WarningDialog';
import { ThemeSwitcher } from '@components/ui/ThemeSwitcher';

interface SettingsMenuProps {
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showDevTools, setShowDevTools } = useContext(AppSettingsContext);
  const menuRef = useRef<HTMLDivElement>(null);

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
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    clearAllUserData();
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div
      className="bg-[var(--color-bg)] p-4 text-[var(--color-text)]"
      ref={menuRef}
    >
      <WarningDialog
        visible={showDeleteModal}
        message={t('delete_local_data_warning')}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <h2 className="mb-4 text-lg font-bold">{t('settings')}</h2>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('language') || 'Language'}</span>
          <LanguageSwitcher />
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center justify-between text-[var(--color-text)]">
          <span>{t('theme')}</span>
          <div className="min-w-[120px]">
            <ThemeSwitcher />
          </div>
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
