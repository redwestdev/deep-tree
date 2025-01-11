import React from 'react';

import s from './HomePage.module.scss';
import ReportSection from './sections/ReportSection';
import WelcomeSct from './sections/WelcomeSct';

/**
 *  HomePage
 */
// A page as an entity is needed to connect sections to each other
export default function HomePage() {
  return (
    <div className={s.HomePage}>
      <WelcomeSct/>
      <ReportSection/>
    </div>
  );
}



