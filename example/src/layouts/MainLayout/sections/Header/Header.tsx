import React from 'react';

import s from './Header.module.scss';
import Button from 'ui/Button';
import { useThemeMng } from 'managers/ThemeMng';



/**
 *  Header for main layout
 */

export default function Header() {
  const {theme, toggle} = useThemeMng();
  return (
    <header className={s.Header}>
        <span>Main layout</span>
        <div>
          <Button className={s.themeBtn} onClick={()=> toggle()}>{theme} theme</Button>
        </div>
    </header>
  );
}



