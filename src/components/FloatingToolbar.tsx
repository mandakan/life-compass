import React, { useState } from 'react';
import DesktopToolbar from './DesktopToolbar';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

interface FloatingToolbarProps {
  onAddNewLifeArea: () => void;
  onAddPredefinedAreas: () => void;
  onToggleRadar: () => void;
  showRadar: boolean;
  onImportFile: (fileContent: string) => void;
  onRemoveAll: () => void;
  footerVisible: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = props => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
  const expandedBottomClass = props.footerVisible ? 'bottom-38' : 'bottom-20';
  const mainButtonBottomClass = props.footerVisible ? 'bottom-20' : 'bottom-4';
  // New view toggle button positioned above the main toggle button
  const viewToggleButtonBottom = props.footerVisible ? 'bottom-40' : 'bottom-24';
  // New modal button positioned above the view toggle button
  const modalButtonBottom = props.footerVisible ? 'bottom-56' : 'bottom-40';

  return (
    <>
      {expanded && (
        <div
          className={`fixed right-4 ${expandedBottomClass} z-60 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 shadow-lg`}
        >
          <DesktopToolbar
            onAddNewLifeArea={handleAddNewLifeArea}
            onAddPredefinedAreas={handleAddPredefinedAreas}
            onImportFile={handleImportFile}
            onRemoveAll={handleRemoveAll}
          />
        </div>
      )}
      {/* Modal button */}
      <button
        onClick={() => setModalOpen(true)}
        className={`fixed right-4 ${modalButtonBottom} z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none`}
        aria-label={t('brief_life_compass_intruction')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="h-6 w-6"
        >
          <circle cx="12" cy="12" r="10" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="12"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            i
          </text>
        </svg>
      </button>
      {/* New view toggle button placed above the main toolbar toggle button */}
      <button
        onClick={handleToggleRadar}
        className={`fixed right-4 ${viewToggleButtonBottom} z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg focus:outline-none`}
        aria-label={
          props.showRadar ? t('show_card_view') : t('show_radar_view')
        }
      >
        {props.showRadar ? (
          // Grid Icon (card view) when radar is active
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="currentColor"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="currentColor"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="currentColor"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="currentColor"
            />
          </svg>
        ) : (
          // Radar Icon when card view is active
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="12"
              y1="3"
              x2="12"
              y2="21"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.5"
            />
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
            className="h-6 w-6"
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
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          {t('brief_life_compass_intruction')}
        </Modal>
      )}
    </>
  );
};

export default FloatingToolbar;
