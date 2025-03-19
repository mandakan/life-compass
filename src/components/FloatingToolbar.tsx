import React, { useState } from 'react';
import DesktopToolbar from './DesktopToolbar';
import { useTranslation } from 'react-i18next';

interface FloatingToolbarProps {
  onAddNewLifeArea: () => void;
  onAddPredefinedAreas: () => void;
  onReset: () => void;
  onToggleRadar: () => void;
  showRadar: boolean;
  onImportFile: (fileContent: string) => void;
  onRemoveAll: () => void;
  footerVisible: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = props => {
  const { t } = useTranslation();
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

  const handleRemoveAll = () => {
    props.onRemoveAll();
    setExpanded(false);
  };

  // Adjust bottom offset when footer is visible: increased offset values to move toolbar up further
  const expandedBottomClass = props.footerVisible ? 'bottom-32' : 'bottom-20';
  const mainButtonBottomClass = props.footerVisible ? 'bottom-4' : 'bottom-4';
  // New button positioned above the main toggle button
  const viewToggleButtonBottom = props.footerVisible ? 'bottom-44' : 'bottom-24';

  return (
    <>
      {expanded && (
        <div className={`fixed right-4 ${expandedBottomClass} z-60 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 shadow-lg`}>
          <DesktopToolbar
            onAddNewLifeArea={handleAddNewLifeArea}
            onAddPredefinedAreas={handleAddPredefinedAreas}
            onReset={handleReset}
            onToggleRadar={handleToggleRadar}
            showRadar={props.showRadar}
            onImportFile={handleImportFile}
            onRemoveAll={handleRemoveAll}
          />
        </div>
      )}
      {/* New view toggle button placed above the main toolbar toggle button */}
      <button
        onClick={handleToggleRadar}
        className={`fixed right-4 ${viewToggleButtonBottom} z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none`}
        aria-label={props.showRadar ? t('show_card_view') : t('show_radar_view')}
      >
        {props.showRadar ? (
          // Grid Icon (card view) when radar is active
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" stroke="currentColor" fill="currentColor" />
            <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" stroke="currentColor" fill="currentColor" />
            <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" stroke="currentColor" fill="currentColor" />
            <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" stroke="currentColor" fill="currentColor" />
          </svg>
        ) : (
          // Radar Icon when card view is active
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </button>
      <button
        onClick={toggleExpanded}
        className={`fixed right-4 ${mainButtonBottomClass} z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none`}
        aria-label={t('quick_actions')}
      >
        {expanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>
    </>
  );
};

export default FloatingToolbar;
