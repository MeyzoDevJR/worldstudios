'use client';

import { usePathname } from 'next/navigation';
import { AppState } from './state';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Providers({ children }) {
  const path = usePathname();
  const manager = path.startsWith('/manager');

  return (
    <AppState>
      <svg className="grain" aria-hidden="true">
        <filter id="ws-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ws-grain)" />
      </svg>
      {!manager && <Nav />}
      <div key={path} className="page-in">
        {children}
      </div>
      {!manager && <Footer />}
    </AppState>
  );
}
