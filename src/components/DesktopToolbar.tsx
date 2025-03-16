import React from 'react';
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
  const handleImportError = (error: string) => {
    alert(error);
  };

  return (
    <div>
      <CustomButton onClick={onAddNewLifeArea}>Lägg till</CustomButton>
      <CustomButton onClick={onAddPredefinedAreas}>
        Lägg till fördefinierade
      </CustomButton>
      <CustomButton onClick={onReset}>Återställ</CustomButton>
      <CustomButton onClick={onRemoveAll}>Ta bort alla</CustomButton>
      <CustomButton onClick={onToggleRadar}>
        {showRadar ? 'Kortvy' : 'Radarvy'}
      </CustomButton>
      <ExportButton />
      <ImportButton onFileSelected={onImportFile} onError={handleImportError} />
    </div>
  );
};

export default DesktopToolbar;
