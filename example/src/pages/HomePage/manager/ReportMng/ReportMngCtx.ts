import { createContext } from 'react';

import { TReportMngSt } from './types';

const ReportMngCtx = createContext<TReportMngSt>({
  opened: false,
  setOpened: () => {},
});

export default ReportMngCtx;
