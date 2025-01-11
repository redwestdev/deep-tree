import React from 'react';

import cn from 'classnames';

import s from './Button.module.scss';

export interface TButtonUIProps extends React.HTMLAttributes<HTMLButtonElement>{
  className?: string;
  size?: 'large' | 'small' | 'middle';
}

/**
 *  Button UI
 *  @param className
 * @param children
 * @param size
 * @param props
 */

export default function Button({ className = '', children, size = 'middle', ...props }: TButtonUIProps) {
  return (
    <button {...props} className={cn(s.Button, s[size], className)}>
      {children}
    </button>
  );
}



