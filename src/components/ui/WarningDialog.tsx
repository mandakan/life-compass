// components/ui/WarningDialog.tsx
import Dialog from './Dialog';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface WarningDialogProps {
  visible: boolean;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={visible}
      onOpenChange={open => {
        if (!open) onCancel(); // ESC, outside click, etc
      }}
      title={t('are_you_sure')}
      type="warning"
    >
      <div className="text-sm">{message}</div>
      <div className="mt-4 space-x-2 text-right">
        <button
          onClick={onCancel}
          className="rounded-sm bg-[var(--color-primary)] px-3 py-1 text-[var(--on-primary)] transition-colors duration-150"
        >
          {t('cancel')}
        </button>
        <button
          onClick={onConfirm}
          className="rounded-sm bg-[var(--color-accent)] px-3 py-1 text-[var(--on-accent)] transition-colors duration-150"
        >
          {t('continue')}
        </button>
      </div>
    </Dialog>
  );
};

export default WarningDialog;
