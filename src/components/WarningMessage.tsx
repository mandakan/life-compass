import React from 'react';

export interface WarningMessageProps {
  message?: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  return (
    <div className="border-l-4 border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--text)] p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">Varning</h3>
      <p>
        {message ? message : "Detta är ett varningsmeddelande för att uppmana försiktighet vid en specifik åtgärd."}
      </p>
    </div>
  );
};

export default WarningMessage;
