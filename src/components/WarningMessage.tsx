import React from 'react';

export interface WarningMessageProps {
  message?: string;
  title?: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message, title }) => {
  return (
    <div className="border-l-4 border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-text)] p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">{title ? title : "Varning"}</h3>
      <p>
        {message ? message : "Detta är ett varningsmeddelande för att uppmana försiktighet vid en specifik åtgärd."}
      </p>
    </div>
  );
};

export default WarningMessage;
