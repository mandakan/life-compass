import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/Button';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import { useConfirmDialog } from './ui/hooks/useConfirmDialog';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
      confirmLabel: t('ok'),
    });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 md:bottom-20">
      {/* Toggle view button */}
      <button
        onClick={onToggleRadar}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--on-primary)] shadow-lg transition-colors hover:opacity-90 focus:outline-none"
        aria-label={showRadar ? t('show_card_view') : t('show_radar_view')}
      >
        {showRadar ? (
          <Squares2X2Icon className="h-6 w-6" />
        ) : (
          <ChartPieIcon className="h-6 w-6" />
        )}
      </button>

      {/* Quick actions popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-[var(--on-primary)] shadow-lg transition-colors hover:opacity-90 focus:outline-none"
            aria-label={t('quick_actions')}
          >
            <Bars3Icon className="mx-auto h-6 w-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-64 rounded-md border border-[var(--border)] bg-[var(--color-bg)] p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <Button variant="primary" onClick={onAddPredefinedAreas}>
              {t('add_predefined')}
            </Button>
            <ExportButton />
            <ImportButton
              onFileSelected={onImportFile}
              onError={handleImportError}
            />
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
