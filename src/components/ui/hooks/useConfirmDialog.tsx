import { useState, useCallback } from 'react';
import Dialog from '@components/ui/Dialog';
import Button from '@components/ui/Button';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type ConfirmDialogType = 'warning' | 'success' | 'info' | 'error';

type ConfirmOptions = {
  message: string | ReactNode;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmDialogType;
};

export const useConfirmDialog = () => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<ReactNode>('');
  const [title, setTitle] = useState<string | undefined>();
  const [confirmLabel, setConfirmLabel] = useState<string>(t('continue'));
  const [cancelLabel, setCancelLabel] = useState<string>(t('cancel'));
  const [type, setType] = useState<ConfirmDialogType>('warning');
  const [resolver, setResolver] = useState<(result: boolean) => void>(
    () => () => {},
  );

  const confirm = useCallback(
    (options: string | ConfirmOptions) => {
      if (typeof options === 'string') {
        setMessage(options);
        setTitle(undefined);
        setConfirmLabel(t('continue'));
        setCancelLabel(t('cancel'));
        setType('warning');
      } else {
        setMessage(options.message);
        setTitle(options.title);
        setConfirmLabel(options.confirmLabel ?? t('continue'));
        setCancelLabel(options.cancelLabel ?? t('cancel'));
        setType(options.type ?? 'warning');
      }

      setVisible(true);
      return new Promise<boolean>(resolve => {
        setResolver(() => resolve);
      });
    },
    [t],
  );

  const handleConfirm = () => {
    setVisible(false);
    resolver(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resolver(false);
  };

  const ConfirmationDialog = visible ? (
    <Dialog
      open={visible}
      onOpenChange={open => {
        if (!open) handleCancel();
      }}
      title={title}
      type={type}
      description={message}
    >
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" size="sm" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  ) : null;

  return { confirm, ConfirmationDialog };
};
