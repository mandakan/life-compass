import { useState, useCallback } from 'react';
import Dialog from '@components/ui/Dialog';
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
  const [resolver, setResolver] = useState<(result: boolean) => void>(() => () => {});

  const confirm = useCallback((options: string | ConfirmOptions) => {
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
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, [t]);

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
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      title={title}
      type={type}
      description={message}
    >
      <div className="mt-4 text-right space-x-2">
        <button
          onClick={handleCancel}
          className="rounded-sm bg-[var(--color-primary)] px-3 py-1 text-[var(--on-primary)]"
        >
          {cancelLabel}
        </button>
        <button
          onClick={handleConfirm}
          className="rounded-sm bg-[var(--color-accent)] px-3 py-1 text-[var(--on-accent)]"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  ) : null;

  return { confirm, ConfirmationDialog };
};