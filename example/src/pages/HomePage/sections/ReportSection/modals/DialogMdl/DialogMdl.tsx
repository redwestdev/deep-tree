import React, { useEffect, useState } from 'react';

import cn from 'classnames';

import s from './DialogMdl.module.scss';
import Button from 'ui/Button';
import { useReportMng } from 'pages/HomePage/manager/ReportMng';

interface Props {
  className?: string;
}

/**
 *  DialogMdl
 *  @param className
 */

export default function DialogMdl({ className = '' }: Props) {
  const { opened, setOpened } = useReportMng();
  const [isVisible, setIsVisible] = useState(false);
  // Добавляем анимацию появления/исчезновения
  useEffect(() => {
    if (opened) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        // Ждем анимации, прежде чем убрать из DOM
        setIsVisible(false);
      }, 300); // Задержка должна совпадать с длительностью анимации
      return () => clearTimeout(timeout);
    }
  }, [opened]);

  if (!opened && !isVisible) return null;
  return (
    <div className={cn(s.DialogOverlay, { [s.open]: opened })}>
      <div className={cn(s.DialogMdl, className, { [s.fadeIn]: opened, [s.fadeOut]: !opened })}>
        <header className={s.dialogHeader}>Create report?</header>
        <footer className={s.dialogFooter}>
          <Button onClick={() => {
            console.log('Report Created!');
            setOpened(false);
          }}>Yes</Button>
            <Button onClick={() => {
            console.log('Action Canceled!');
            setOpened(false);
          }}>No</Button>
        </footer>
      </div>
    </div>
  );
}



