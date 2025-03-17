import React from 'react';
import WarningModal from './WarningModal';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <WarningModal
      visible={visible}
      message={
        <div>
          <p>
            <strong>{t("exported")}:</strong> {metadata.exportTimestamp}
          </p>
          <p>
            <strong>{t("version")}:</strong> {metadata.version}
          </p>
          <p>
            <strong>{t("life_areas_count")}:</strong> {data.lifeAreas.length}
          </p>
          <p>
            <strong>{t("history_count")}:</strong> {data.history.length}
          </p>
          <p>{t("import_data_prompt")}</p>
        </div>
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default ImportPreviewModal;
