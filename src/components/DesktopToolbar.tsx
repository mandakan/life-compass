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
}

const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  onAddNewLifeArea,
  onAddPredefinedAreas,
  onReset,
  onToggleRadar,
  showRadar,
}) => {
  const handleImportFile = (fileContent: string) => {
    console.log("Importerad filinnehåll:", fileContent);
    // TODO: Process the JSON content in later steps.
  };

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
        onFileSelected={handleImportFile} 
        onError={handleImportError} 
      />
    </div>
  );
};

export default DesktopToolbar;
