import { BrowserRouter, Routes, Route } from 'react-router';

import { RoleType } from '~/constants/enums';
import ProtectedRoute from '~/layout/ProtectedRoute';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scoring from './pages/Scoring';
import Leaderboard from './pages/Leaderboard';
import Awards from './pages/Awards';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <>
              <Nav />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Protected routes — all authenticated roles */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE, RoleType.MC, RoleType.MEMBER]} />}>
          <Route
            path="/dashboard"
            element={
              <>
                <Nav />
                <main>
                  <Dashboard />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <>
                <Nav />
                <main>
                  <Leaderboard />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/awards"
            element={
              <>
                <Nav />
                <main>
                  <Awards />
                </main>
                <Footer />
              </>
            }
          />
        </Route>

        {/* Admin + BGK only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
          <Route
            path="/scoring"
            element={
              <>
                <Nav />
                <main>
                  <Scoring />
                </main>
                <Footer />
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
