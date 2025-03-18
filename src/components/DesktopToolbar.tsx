import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from './CustomButton';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';

interface DesktopToolbarProps {
  onAddNewLifeArea: () => void;
  onAddPredefinedAreas: () => void;
  onReset: () => void;
  onToggleRadar: () => void;
  showRadar: boolean;
  onImportFile: (fileContent: string) => void;
  onRemoveAll: () => void;
}

const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  onAddNewLifeArea,
  onAddPredefinedAreas,
  onReset,
  onToggleRadar,
  showRadar,
  onImportFile,
  onRemoveAll,
}) => {
  const { t } = useTranslation();
  const handleImportError = (error: string) => {
    alert(error);
  };

  return (
    <div>
      <CustomButton onClick={onAddPredefinedAreas}>
        {t('add_predefined')}
      </CustomButton>
      <CustomButton onClick={onReset}>{t('reset')}</CustomButton>
      <CustomButton onClick={onRemoveAll}>{t('delete_all')}</CustomButton>
      <CustomButton onClick={onToggleRadar}>
        {showRadar ? t('card_view') : t('radar_view')}
      </CustomButton>
      <ExportButton />
      <ImportButton onFileSelected={onImportFile} onError={handleImportError} />
    </div>
  );
};

export default DesktopToolbar;
