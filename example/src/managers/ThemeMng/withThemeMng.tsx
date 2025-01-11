import React, { PropsWithChildren } from 'react';

import ThemeMngPrvd from './ThemeMngPrvd';

export default function withThemeMng<P>(
  Component: React.ComponentType<PropsWithChildren<P>>,
) {
  return (props: PropsWithChildren<P>) => {
    return (
      <ThemeMngPrvd>
        <Component {...props} />
      </ThemeMngPrvd>
    );
  };
}
