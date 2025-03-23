// components/ui/hooks/useSuccessDialog.tsx
import { useState, useCallback } from 'react';
import Dialog from '../Dialog';
import CustomButton from '@components/CustomButton';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

export const useSuccessDialog = () => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<ReactNode>('');
  const [title, setTitle] = useState<string | undefined>();

  const show = useCallback((options: string | { message: ReactNode; title?: string }) => {
    if (typeof options === 'string') {
      setMessage(options);
      setTitle(undefined);
    } else {
      setMessage(options.message);
      setTitle(options.title);
    }

    setVisible(true);
  }, []);

  const close = () => setVisible(false);

  const SuccessDialog = visible ? (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title={title ?? t('success')}
      type="success"
      description={message}
    >
      <div className="mt-4 text-right">
        <CustomButton onClick={close}>{t('ok')}</CustomButton>
      </div>
    </Dialog>
  ) : null;

  return { show, SuccessDialog };
};