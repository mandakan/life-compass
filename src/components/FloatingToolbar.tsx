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

const FloatingToolbar: React.FC<FloatingToolbarProps> = props => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const handleAddNewLifeArea = () => {
    props.onAddNewLifeArea();
    setExpanded(false);
  };

  const handleAddPredefinedAreas = () => {
    props.onAddPredefinedAreas();
    setExpanded(false);
  };

  const handleReset = () => {
    props.onReset();
    setExpanded(false);
  };

  const handleToggleRadar = () => {
    props.onToggleRadar();
    setExpanded(false);
  };

  const handleImportFile = (fileContent: string) => {
    props.onImportFile(fileContent);
    setExpanded(false);
  };

  return (
    <>
      {expanded && (
        <div className="fixed right-4 bottom-20 z-50 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 shadow-lg">
          <DesktopToolbar
            onAddNewLifeArea={handleAddNewLifeArea}
            onAddPredefinedAreas={handleAddPredefinedAreas}
            onReset={handleReset}
            onToggleRadar={handleToggleRadar}
            showRadar={props.showRadar}
            onImportFile={handleImportFile}
          />
        </div>
      )}
      <button
        onClick={toggleExpanded}
        className="fixed right-4 bottom-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none"
        aria-label="Quick Actions"
      >
        {expanded ? '×' : '☰'}
      </button>
    </>
  );
};

export default FloatingToolbar;
