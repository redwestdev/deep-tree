import React, { PropsWithChildren } from 'react';

import ReportMngPrvd from './ReportMngPrvd';

export default function withReportMng<P>(
  Component: React.ComponentType<PropsWithChildren<P>>,
) {
  // eslint-disable-next-line react/display-name
  return (props: PropsWithChildren<P>) => {
    return (
      <ReportMngPrvd>
        <Component {...props} />
      </ReportMngPrvd>
    );
  };
}
