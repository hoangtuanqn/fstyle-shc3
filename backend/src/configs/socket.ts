import { parseCookie } from 'cookie';
import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { RoleType, TokenType } from '~/constants/enums';
import { AlgoJwt } from '~/utils/jwt';
import { Helpers } from '~/utils/helpers';

let io: SocketServer;

// In-memory state — resets on server restart (sufficient for single-event use)
const revealedAwardIds: string[] = [];

export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Auth middleware — extracts role from cookie JWT, non-blocking (public viewers allowed)
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next();

      const cookies = parseCookie(cookieHeader);
      const token = cookies.access_token;
      if (!token) return next();

      const payload = await AlgoJwt.verifyToken(token);
      if (Helpers.isTypeToken(payload, TokenType.AccessToken)) {
        socket.data.userId = payload.userId;
        socket.data.role = payload.role;
      }
    } catch {
      // Invalid/expired token — still allow connection for public viewing
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id} role=${socket.data.role ?? 'guest'}`);

    // Send current reveal state to newly connected client
    socket.emit('leaderboard:init', { revealedAwardIds: [...revealedAwardIds] });

    socket.on('award:reveal', ({ awardId }: { awardId: string }) => {
      const role = socket.data.role as RoleType | undefined;
      if (role !== RoleType.ADMIN && role !== RoleType.MC) {
        socket.emit('award:reveal:error', { message: 'Bạn không có quyền thực hiện hành động này!' });
        return;
      }

      if (!awardId || typeof awardId !== 'string') {
        socket.emit('award:reveal:error', { message: 'awardId không hợp lệ!' });
        return;
      }

      if (revealedAwardIds.includes(awardId)) {
        socket.emit('award:reveal:error', { message: 'Giải này đã được công bố!' });
        return;
      }

      revealedAwardIds.push(awardId);
      io.emit('award:revealed', { awardId, revealedAwardIds: [...revealedAwardIds] });
      console.log(`✓ Award revealed: ${awardId} by ${socket.data.userId}`);
    });

    socket.on('award:unreveal', ({ awardId }: { awardId: string }) => {
      const role = socket.data.role as RoleType | undefined;
      if (role !== RoleType.ADMIN && role !== RoleType.MC) {
        socket.emit('award:reveal:error', { message: 'Bạn không có quyền thực hiện hành động này!' });
        return;
      }

      if (!awardId || typeof awardId !== 'string') {
        socket.emit('award:reveal:error', { message: 'awardId không hợp lệ!' });
        return;
      }

      const idx = revealedAwardIds.indexOf(awardId);
      if (idx === -1) {
        socket.emit('award:reveal:error', { message: 'Giải này chưa được công bố!' });
        return;
      }

      revealedAwardIds.splice(idx, 1);
      io.emit('award:revealed', { awardId: null, revealedAwardIds: [...revealedAwardIds] });
      console.log(`✓ Award unreveal: ${awardId} by ${socket.data.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
