import React, { useRef } from 'react';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

interface ImportButtonProps {
  onFileSelected: (fileContent: string) => void;
  onError?: (error: string) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({
  onFileSelected,
  onError,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      if (onError) {
        onError(t('invalid_file_type'));
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      try {
        JSON.parse(content);
        onFileSelected(content);
      } catch (err) {
        if (onError) {
          onError(t('invalid_json_file'));
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      if (onError) {
        onError(t('error_reading_file'));
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <CustomButton onClick={handleButtonClick}>{t('import')}</CustomButton>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImportButton;
