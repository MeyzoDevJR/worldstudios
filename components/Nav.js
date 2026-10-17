'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';
import { useAuth, useSound } from './state';

const links = [
  { href: '/#base', label: 'La base' },
  { href: '/#licence', label: 'Licence' },
  { href: '/partenariat', label: 'Partenariat' },
];

export function Nav() {
  const { user } = useAuth();
  const { enabled, toggleSound } = useSound();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  return (
    <header className="nav">
      <div className="nav-in">
        <Link href="/" className="brand" data-sound="open">
          <img src="/logo.png" alt="" width="42" height="42" />
          <span>World Studios</span>
        </Link>
        <nav className={open ? 'links open' : 'links'}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          {user?.role === 'manager' && <Link href="/manager">Manager</Link>}
          {user ? (
            <Link href="/compte" className="nav-pill">
              Mon espace
            </Link>
          ) : (
            <Link href="/connexion" className="nav-pill">
              Connexion
            </Link>
          )}
        </nav>
        <div className="nav-tools">
          <button type="button" className="icon-btn" data-sound="off" onClick={toggleSound} aria-pressed={enabled} aria-label={enabled ? 'Couper le son' : 'Activer le son'}>
            {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button type="button" className="icon-btn burger" data-sound="open" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
