import React from 'react';

import s from './ReportSection.module.scss';
import OpenReportBtn from './components/OpenReportBtn';
import DialogMdl from './modals/DialogMdl';


/**
 *  ReportSection
 */

export default function ReportSection() {
  return (
    <section className={s.ReportSection}>
      <OpenReportBtn reportVariant="advance" />
      <DialogMdl/>
    </section>
  );
}



