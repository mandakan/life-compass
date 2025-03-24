import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/Button';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import { useConfirmDialog } from './ui/hooks/useConfirmDialog';

interface FloatingToolbarProps {
  onAddPredefinedAreas: () => void;
  onToggleRadar: () => void;
  showRadar: boolean;
  onImportFile: (fileContent: string) => void;
  onRemoveAll: () => void;
  footerVisible: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onAddPredefinedAreas,
  onToggleRadar,
  showRadar,
  onImportFile,
  onRemoveAll,
  footerVisible,
}) => {
  const { t } = useTranslation();
  const { confirm, ConfirmationDialog } = useConfirmDialog();
  const handleImportError = async (error: string) => {
    await confirm({
      type: 'error',
      message: error,
      confirmLabel: t('ok')
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-20">
      {/* Toggle view button */}
      <button
        onClick={onToggleRadar}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--on-primary)] shadow-lg transition-colors hover:opacity-90 focus:outline-none"
        aria-label={showRadar ? t('show_card_view') : t('show_radar_view')}
      >
        {showRadar ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
          </svg>
        )}
      </button>

      {/* Quick actions popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-[var(--on-primary)] shadow-lg hover:opacity-90 transition-colors focus:outline-none"
            aria-label={t('quick_actions')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-64 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <Button variant="primary" onClick={onAddPredefinedAreas}>
              {t('add_predefined')}
            </Button>
            <ExportButton />
            <ImportButton onFileSelected={onImportFile} onError={handleImportError} />
            <Button variant="accent" onClick={onRemoveAll}>
              {t('delete_all')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingToolbar;
