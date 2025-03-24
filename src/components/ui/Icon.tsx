// components/ui/Icon.tsx
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const icons = {
  close: XMarkIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
};

export const Icon = ({
  name,
  className,
}: {
  name: keyof typeof icons;
  className?: string;
}) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
};
