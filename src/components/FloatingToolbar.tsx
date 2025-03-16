import React, { useState } from 'react';
import DesktopToolbar from './DesktopToolbar';

interface FloatingToolbarProps {
  onAddNewLifeArea: () => void;
  onAddPredefinedAreas: () => void;
  onReset: () => void;
  onToggleRadar: () => void;
  showRadar: boolean;
  onImportFile: (fileContent: string) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  return (
    <>
      {expanded && (
        <div className="fixed bottom-20 right-4 z-50 bg-[var(--color-bg)] p-4 rounded-md shadow-lg border border-[var(--border)]">
          <DesktopToolbar
            onAddNewLifeArea={props.onAddNewLifeArea}
            onAddPredefinedAreas={props.onAddPredefinedAreas}
            onReset={props.onReset}
            onToggleRadar={props.onToggleRadar}
            showRadar={props.showRadar}
            onImportFile={props.onImportFile}
          />
        </div>
      )}
      <button 
        onClick={toggleExpanded}
        className="fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none"
        aria-label="Quick Actions"
      >
        {expanded ? "×" : "☰"}
      </button>
    </>
  );
};

export default FloatingToolbar;
