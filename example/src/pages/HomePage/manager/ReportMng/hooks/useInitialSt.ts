import { useContext, useState } from 'react';
import { TReportMngSt } from '../types';
import ReportMngCtx from '../ReportMngCtx';

export const useReportMng = () =>
  useContext(ReportMngCtx);

export default function useInitialSt(): TReportMngSt {
    const [opened, setOpened] = useState<boolean>(false);
    
    return {
        opened,
        setOpened
    }
}
