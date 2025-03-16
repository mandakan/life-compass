import React, { useState } from 'react';
import { exportData } from '../utils/exportService';
import CustomButton from './CustomButton';
import WarningModal from './WarningModal';

const ExportButton: React.FC = () => {
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
    } catch (error: any) {
      setError('Error exporting data: ' + error.message);
    }
  };

  const handleModalClose = () => {
    setError('');
  };

  return (
    <>
      <CustomButton onClick={handleExport}>Exportera</CustomButton>
      {error && (
        <WarningModal
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
