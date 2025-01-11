import React from 'react';

import useInitialSt from './hooks/useInitialSt';

import ReportMngCtx from './ReportMngCtx';


interface TReportMngPrvdProps {
  children: React.ReactNode;
}

export default function ReportMngPrvd({
                                        children,
                                      }: TReportMngPrvdProps) {
  const value = useInitialSt();
  return (
    <ReportMngCtx.Provider
      value={value}
    >
      {children}
    </ReportMngCtx.Provider>
  );
}
