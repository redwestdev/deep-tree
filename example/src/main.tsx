import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App';
import { ReportMngPrvd } from 'pages/HomePage/manager/ReportMng';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReportMngPrvd>
      <App />
    </ReportMngPrvd>
  </StrictMode>,
)
