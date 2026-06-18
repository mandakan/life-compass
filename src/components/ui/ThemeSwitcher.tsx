import { useTheme } from '@context/ThemeContext';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // switched from radix to heroicons
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Select.Root
      value={theme}
      onValueChange={(value: 'light' | 'dark' | 'high-contrast') =>
        setTheme(value)
      }
    >
      <Select.Trigger className="border-border bg-surface text-text shadow-warm-sm duration-base ease-out-soft focus-visible:outline-focus inline-flex min-h-[44px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
        <Select.Value placeholder={t('choose_theme')} />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="border-border bg-surface text-text shadow-warm-md z-50 rounded-md border p-1">
          <Select.Viewport>
            {(['light', 'dark', 'high-contrast'] as const).map(value => (
              <Select.Item
                key={value}
                value={value}
                className="hover:bg-surface-sunken focus-visible:bg-surface-sunken data-[state=checked]:text-primary cursor-pointer rounded-sm px-2 py-2 text-base select-none focus-visible:outline-none data-[state=checked]:font-medium"
              >
                <Select.ItemText>{t(`theme.${value}`)}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default ThemeSwitcher;
