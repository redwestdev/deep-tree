import React from 'react';

import cn from 'classnames';

import s from './OpenReportBtn.module.scss';
import Button, {TButtonUIProps} from '../../../../../../ui/Button';
import { useReportMng } from 'pages/HomePage/manager/ReportMng';

interface Props extends TButtonUIProps{
  reportVariant: 'simple' | 'advance';
}

/**
 *  OpenReportBtn
 *  @param className
 */

export default function OpenReportBtn({ className = '', reportVariant }: Props) {
  const { setOpened } = useReportMng();// get report mng
  return (
    <Button className={cn(s.OpenReportBtn,s[reportVariant], className)} onClick={() => setOpened((open)=>(!open))}>
      Create Report
    </Button>
  );
}



