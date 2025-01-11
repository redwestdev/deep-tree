import { useMediaQuery } from 'react-responsive';
import { TAppTheme } from 'managers/ThemeMng/types';

export default function useSystemTheme(): TAppTheme {
  // Определение, предпочитает ли пользователь тёмную тему
  const prefersDarkMode = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

  // Возвращаем текущую тему
  return prefersDarkMode ? 'dark' : 'light';
}
