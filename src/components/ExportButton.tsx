import React from 'react';
import { exportData } from '@utils/exportService';
import { useTranslation } from 'react-i18next';
import Button from '@components/ui/Button';
import { useConfirmDialog } from '@components/ui/hooks/useConfirmDialog';

const ExportButton: React.FC = () => {
  const { t } = useTranslation();
  const { confirm, ConfirmationDialog } = useConfirmDialog();

  const handleExport = async () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `life_compass_export_${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      await confirm({
        type: 'error',
        title: t('export_failed'),
        message:
          error instanceof Error
            ? `${t('error_exporting_data')}: ${error.message}`
            : t('error_exporting_data'),
        confirmLabel: t('ok'),
      });
    }
  };

  return (
    <>
      <Button onClick={handleExport}>{t('export')}</Button>
      {ConfirmationDialog}
    </>
  );
};

export default ExportButton;
