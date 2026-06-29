import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

import type { Socket } from 'socket.io-client';

import LocalStorage from '~/utils/localStorage';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const useSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = LocalStorage.getItem('access_token');
    const socket = io(SOCKET_URL, { withCredentials: true, auth: { token } });
    socketRef.current = socket;

    socket.on('scores:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-teams'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-team-scores'] });
    });

    socket.on('awards:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return socketRef;
};

export default useSocket;
