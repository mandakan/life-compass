import * as RadixDialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Icon } from './Icon';
import { ReactNode } from 'react';

type DialogType = 'default' | 'success' | 'warning' | 'error' | 'info';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: ReactNode;
  type?: DialogType;
  icon?: ReactNode;
  children: ReactNode;
}

const typeStyles: Record<DialogType, { iconColor: string }> = {
  default: { iconColor: 'text-[var(--color-text)]' },
  success: { iconColor: 'text-green-600' },
  warning: { iconColor: 'text-yellow-600' },
  error: { iconColor: 'text-red-600' },
  info: { iconColor: 'text-blue-600' },
};

const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  type = 'default',
  icon,
  children,
}: DialogProps) => {
  const { iconColor } = typeStyles[type];

  const defaultIcons: Partial<Record<DialogType, ReactNode>> = {
    success: <Icon name="success" className={clsx('h-5 w-5', iconColor)} />,
    warning: <Icon name="warning" className={clsx('h-5 w-5', iconColor)} />,
    error: <Icon name="warning" className={clsx('h-5 w-5', iconColor)} />,
    info: <Icon name="success" className={clsx('h-5 w-5', iconColor)} />,
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <RadixDialog.Content
          className={clsx(
            'fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-lg',
            'bg-[var(--color-bg)] text-[var(--color-text)]',
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              {icon ?? defaultIcons[type]}
              {title && (
                <RadixDialog.Title className="text-lg font-semibold">
                  {title}
                </RadixDialog.Title>
              )}
            </div>
            <RadixDialog.Close className="p-1 text-sm hover:opacity-70">
              <Icon name="close" className="h-5 w-5" />
            </RadixDialog.Close>
          </div>

          {description && (
            <RadixDialog.Description className="mb-4 text-sm">
              {description}
            </RadixDialog.Description>
          )}

          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Dialog;
