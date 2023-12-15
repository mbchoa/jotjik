'use client';

import { TimerProvider } from '@/contexts/TimerContext';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <TimerProvider>{children}</TimerProvider>
  </SessionProvider>
);
