import { Outlet } from 'react-router';

import Nav from '~/components/Nav';
import Footer from '~/components/Footer';

const MainLayout = () => {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
