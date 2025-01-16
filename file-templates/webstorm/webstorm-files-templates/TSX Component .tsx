import React from 'react';

import cn from 'classnames';

import s from './${NAME}.module.scss';

interface Props {
  className?: string;
}

/**
 *  ${NAME} 
 *  @param className
 */

export default function ${NAME}({ className = '' }: Props) {
  return(
      <div className={cn(s.${NAME}, className)}>
        
      </div>
  )
}



