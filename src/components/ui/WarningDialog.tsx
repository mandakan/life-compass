// components/ui/WarningDialog.tsx
import Dialog from './Dialog';
import Button from './Button';
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
      <div className="text-base">{message}</div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          {t('continue')}
        </Button>
      </div>
    </Dialog>
  );
};

export default WarningDialog;
