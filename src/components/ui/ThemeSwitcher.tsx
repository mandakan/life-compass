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
      onValueChange={(
        value: 'light' | 'dark' | 'high-contrast' | 'sugar-sweet',
      ) => setTheme(value)}
    >
      <Select.Trigger className="inline-flex items-center justify-between rounded border px-3 py-1 text-sm shadow-sm focus:outline-none">
        <Select.Value placeholder={t('choose_theme')} />
        <Select.Icon>
          <ChevronDownIcon className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 rounded border bg-[var(--color-bg)] p-1 shadow-md">
          <Select.Viewport>
            {(['light', 'dark', 'high-contrast', 'sugar-sweet'] as const).map(
              value => (
                <Select.Item
                  key={value}
                  value={value}
                  className="cursor-pointer rounded px-2 py-1 text-sm select-none hover:bg-[var(--hover-bg)] focus:bg-[var(--focus-bg)]"
                >
                  <Select.ItemText>{t(`theme.${value}`)}</Select.ItemText>
                </Select.Item>
              ),
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
