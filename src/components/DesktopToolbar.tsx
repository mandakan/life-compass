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
      <CustomButton onClick={onAddNewLifeArea}>{t("Lägg till")}</CustomButton>
      <CustomButton onClick={onAddPredefinedAreas}>
        {t("Lägg till fördefinierade")}
      </CustomButton>
      <CustomButton onClick={onReset}>{t("Återställ")}</CustomButton>
      <CustomButton onClick={onRemoveAll}>{t("Ta bort alla")}</CustomButton>
      <CustomButton onClick={onToggleRadar}>
        {showRadar ? t("Kortvy") : t("Radarvy")}
      </CustomButton>
      <ExportButton />
      <ImportButton onFileSelected={onImportFile} onError={handleImportError} />
    </div>
  );
};

export default DesktopToolbar;
