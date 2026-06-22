import { BrowserRouter, Routes } from 'react-router';

import useScrollToTop from '~/hooks/useScrollToTop';
import { AppRoutes } from '~/routes';

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>{AppRoutes()}</Routes>
    </BrowserRouter>
  );
}
