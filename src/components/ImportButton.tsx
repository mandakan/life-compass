import React, { useRef } from 'react';
import CustomButton from './CustomButton';

interface ImportButtonProps {
  onFileSelected: (fileContent: string) => void;
  onError?: (error: string) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ onFileSelected, onError }) => {
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
        onError('Ogiltig filtyp. Vänligen välj en JSON-fil.');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        JSON.parse(content);
        onFileSelected(content);
      } catch (err) {
        if (onError) {
          onError('Filen kunde inte läsas som giltig JSON.');
        }
      }
    };
    reader.onerror = () => {
      if (onError) {
        onError('Ett fel inträffade vid läsning av filen.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <CustomButton onClick={handleButtonClick}>
        Importera JSON
      </CustomButton>
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
