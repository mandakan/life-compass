import React from 'react';
import { exportData } from '../utils/exportService';
import CustomButton from './CustomButton';

const ExportButton: React.FC = () => {
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
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    }
  };

  return (
    <CustomButton onClick={handleExport}>
      Export Data as JSON
    </CustomButton>
  );
};

export default ExportButton;
