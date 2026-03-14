'use client';

import React from 'react';

import Sidebar from '@/components/Sidebar';
import UserBar from '@/components/UserBar';
import ParticleCanvas from '@/components/ParticleCanvas';
import SearchOverlay from '@/components/SearchOverlay';
import ScrollObserver from '@/components/ScrollObserver';
import { AuthProvider } from '@/context/AuthContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ScrollObserver />
      <div className="layout">
        <Sidebar />
        <UserBar />
        <ParticleCanvas />
        <SearchOverlay />
        <main className="main">
          <div className="main__content">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
