// ThemeSwitcher.tsx
import { useTheme } from '@context/ThemeContext';
import * as Select from '@radix-ui/react-select';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Select.Root value={theme} onValueChange={(value) => setTheme(value as any)}>
      <Select.Trigger className="px-3 py-1 rounded border">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="light" className="px-2 py-1">Light</Select.Item>
        <Select.Item value="dark" className="px-2 py-1">Dark</Select.Item>
        <Select.Item value="high-contrast" className="px-2 py-1">High Contrast</Select.Item>
      </Select.Content>
    </Select.Root>
  );
};