import React from 'react';

const WarningMessage: React.FC = () => {
  return (
    <div className="border-l-4 border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--text)] p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">Varning</h3>
      <p>
        Detta är ett varningsmeddelande för att uppmana försiktighet vid en specifik åtgärd.
      </p>
    </div>
  );
};

export default WarningMessage;
