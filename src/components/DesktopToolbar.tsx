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
}

const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  onAddNewLifeArea,
  onAddPredefinedAreas,
  onReset,
  onToggleRadar,
  showRadar,
  onImportFile,
}) => {
  const handleImportError = (error: string) => {
    alert(error);
  };

  return (
    <div>
      <CustomButton onClick={onAddNewLifeArea}>
        Lägg till livsområde
      </CustomButton>
      <CustomButton onClick={onAddPredefinedAreas}>
        Lägg till fördefinierade områden
      </CustomButton>
      <CustomButton onClick={onReset}>
        Återställ till standard
      </CustomButton>
      <CustomButton onClick={onToggleRadar}>
        {showRadar ? 'Visa kortvy' : 'Visa radarvy'}
      </CustomButton>
      <ExportButton />
      <ImportButton 
        onFileSelected={onImportFile} 
        onError={handleImportError} 
      />
    </div>
  );
};

export default DesktopToolbar;
