import { BrowserRouter, Routes, Route } from 'react-router';

import { RoleType } from '~/constants/enums';
import useScrollToTop from '~/hooks/useScrollToTop';
import ProtectedRoute from '~/layout/ProtectedRoute';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scoring from './pages/Scoring';
import Leaderboard from './pages/Leaderboard';
import VotingLeaderboard from './pages/VotingLeaderboard';
import Awards from './pages/Awards';

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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

        {/* Dashboard (voting) — members + BTC FStyle only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.MEMBER, RoleType.BTC_FSTYLE]} />}>
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
        </Route>

        {/* Leaderboard — Admin + MC only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.MC]} />}>
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
        </Route>

        {/* Voting Leaderboard — Admin + BTC FStyle + MC */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE, RoleType.MC]} />}>
          <Route
            path="/voting-leaderboard"
            element={
              <>
                <Nav />
                <main>
                  <VotingLeaderboard />
                </main>
                <Footer />
              </>
            }
          />
        </Route>

        {/* Awards — Admin + BTC FStyle only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
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

        {/* Admin only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN]} />}>
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
