import React from 'react';

export interface WarningMessageProps {
  message?: string;
  title?: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message, title }) => {
  return (
    <div className="my-4 border-l-4 border-[var(--color-accent)] bg-[var(--color-bg)] p-4 text-[var(--color-text)]">
      <h3 className="mb-2 text-lg font-semibold">
        {title ? title : 'Varning'}
      </h3>
      <p>
        {message
          ? message
          : 'Detta är ett varningsmeddelande för att uppmana försiktighet vid en specifik åtgärd.'}
      </p>
    </div>
  );
};

export default WarningMessage;
