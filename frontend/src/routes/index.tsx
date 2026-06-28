import { Route } from 'react-router';

import { RoleType } from '~/constants/enums';
import MainLayout from '~/layout/MainLayout';
import ProtectedRoute from '~/layout/ProtectedRoute';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import Scoring from '~/pages/Scoring';
import Leaderboard from '~/pages/Leaderboard';
import VotingLeaderboard from '~/pages/VotingLeaderboard';
import Awards from '~/pages/Awards';
import Screen from '~/pages/Screen';

export const AppRoutes = () => (
  <>
    {/* Public screen display — no auth, no layout */}
    <Route path="/screen" element={<Screen />} />

    {/* Public */}
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
    </Route>
    <Route path="/login" element={<Login />} />

    {/* Members + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.MEMBER, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>

    {/* Admin + MC */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.MC]} />}>
      <Route element={<MainLayout />}>
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Route>

    {/* Admin + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/voting-leaderboard" element={<VotingLeaderboard />} />
      </Route>
    </Route>

    {/* Admin + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/awards" element={<Awards />} />
      </Route>
    </Route>

    {/* Admin only */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN]} />}>
      <Route element={<MainLayout />}>
        <Route path="/scoring" element={<Scoring />} />
      </Route>
    </Route>
  </>
);
