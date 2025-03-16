import React from 'react';
import CustomButton from './CustomButton';
import ExportButton from './ExportButton';

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
    </div>
  );
};

export default DesktopToolbar;
