import React, { useState } from 'react';


import s from './WelcomeSct.module.scss';
import reactLogo from 'assets/react.svg';
import cn from 'classnames';
import Button from 'ui/Button';



/**
 *  WelcomeSct
 */

export default function WelcomeSct() {
  const [count, setCount] = useState(0);
  return (
    <div className={s.WelcomeSct}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={'/vite.svg'} className={s.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className={cn(s.logo, s.react)} alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={s.card}>
        <Button size="large" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={s.readTheDoc}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}



