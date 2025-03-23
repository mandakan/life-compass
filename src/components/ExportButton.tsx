import React, { useState } from 'react';
import { exportData } from '@utils/exportService';
import CustomButton from './CustomButton';
import WarningDialog from '@components/ui/WarningDialog';
import { useTranslation } from 'react-i18next';

const ExportButton: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const handleExport = () => {
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
      if (error instanceof Error) {
        setError(t('error_exporting_data') + ': ' + error.message);
      } else {
        setError(t('error_exporting_data'));
      }
    }
  };

  const handleModalClose = () => {
    setError('');
  };

  return (
    <>
      <CustomButton onClick={handleExport}>{t('export')}</CustomButton>
      {error && (
        <WarningDialog
          visible={true}
          message={error}
          onConfirm={handleModalClose}
          onCancel={handleModalClose}
        />
      )}
    </>
  );
};

export default ExportButton;
