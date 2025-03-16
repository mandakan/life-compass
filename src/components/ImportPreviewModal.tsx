import React from 'react';
import WarningModal from './WarningModal';

interface ImportPreviewModalProps {
  visible: boolean;
  metadata: {
    exportTimestamp: string;
    version: string;
  };
  data: {
    lifeAreas: any[];
    history: any[];
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  visible,
  metadata,
  data,
  onConfirm,
  onCancel,
}) => {
  return (
    <WarningModal
      visible={visible}
      message={
        <div>
          <p><strong>Exporterad:</strong> {metadata.exportTimestamp}</p>
          <p><strong>Version:</strong> {metadata.version}</p>
          <p><strong>Antal livsområden:</strong> {data.lifeAreas.length}</p>
          <p><strong>Antal historik-poster:</strong> {data.history.length}</p>
          <p>Vill du importera dessa data?</p>
        </div>
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default ImportPreviewModal;
