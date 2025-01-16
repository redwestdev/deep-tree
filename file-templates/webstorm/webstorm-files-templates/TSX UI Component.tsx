import cn from 'classnames';

import s from './${NAME}.module.scss';

interface T${NAME}Props extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >{
  className?: string;
}

/**
 *  ${NAME} 
 *  @param className
 */

export default function ${NAME}({ className = '', children }: T${NAME}Props) {
  return(
      <div className={cn(s.${NAME}, className)}>
        {children}
      </div>
  )
}



