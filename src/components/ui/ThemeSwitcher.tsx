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
      <Select.Trigger className="inline-flex min-h-[44px] items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-base text-text shadow-warm-sm transition-colors duration-base ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
        <Select.Value placeholder={t('choose_theme')} />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 rounded-md border border-border bg-surface p-1 text-text shadow-warm-md">
          <Select.Viewport>
            {(['light', 'dark', 'high-contrast'] as const).map(value => (
              <Select.Item
                key={value}
                value={value}
                className="cursor-pointer rounded-sm px-2 py-2 text-base select-none hover:bg-surface-sunken focus-visible:bg-surface-sunken focus-visible:outline-none data-[state=checked]:font-medium data-[state=checked]:text-primary"
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
