
import { withThemeMng } from 'managers/ThemeMng';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from 'pages/HomePage';
import MainLayout from 'layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout/>}>
          <Route index element={<HomePage />} />
          <Route path="contact-us" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

// another option for connecting a manager via HOC (for example)
export default withThemeMng(App)
