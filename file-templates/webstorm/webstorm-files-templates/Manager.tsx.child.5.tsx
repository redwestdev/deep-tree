import React, { PropsWithChildren } from 'react';

import ${NAME}Prvd from './${NAME}Prvd';

export default function with${NAME}Prvd<P>(
  Component: React.ComponentType<PropsWithChildren<P>>
) {
  // eslint-disable-next-line react/display-name
  return (props: PropsWithChildren<P>) => {
    return (
      <${NAME}Prvd>
        <Component {...props} />
      </${NAME}Prvd>
    );
  };
}
