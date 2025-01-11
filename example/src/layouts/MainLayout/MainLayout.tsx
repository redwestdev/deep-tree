import React from 'react';

import cn from 'classnames';

import s from './MainLayout.module.scss';
import { Outlet } from 'react-router';
import Header from './sections/Header';

/**
 *  MainLayout
 */

export default function MainLayout() {
  return (
    <main className={cn(s.MainLayout)}>
      <Header/>
      <div className={s.inner}>
        <Outlet/>
      </div>
      {/*<Footer/>*/}
    </main>
  );
}



