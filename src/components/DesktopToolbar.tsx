import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from './CustomButton';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';

interface DesktopToolbarProps {
  onAddNewLifeArea: () => void;
  onAddPredefinedAreas: () => void;
  onImportFile: (fileContent: string) => void;
  onRemoveAll: () => void;
}

const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  onAddNewLifeArea,
  onAddPredefinedAreas,
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
      <CustomButton onClick={onRemoveAll}>{t('delete_all')}</CustomButton>
      <ExportButton />
      <ImportButton onFileSelected={onImportFile} onError={handleImportError} />
    </div>
  );
};

export default DesktopToolbar;
