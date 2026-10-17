'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useSound, useToast } from '../../components/state';

function Form() {
  const { login } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get('next') || '/compte';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/compte';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      sound.play('success');
      toast('Connexion réussie.');
      router.push(next);
    } catch (err) {
      sound.play('error');
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-screen">
      <form className="panel" onSubmit={onSubmit}>
        <p className="kicker">Espace</p>
        <h1>Connexion</h1>
        <p className="muted">Retrouve ta licence, tes achats et le téléchargement de la base.</p>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <div className="pass">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" data-sound="off" onClick={() => setShow((v) => !v)}>{show ? 'Cacher' : 'Voir'}</button>
          </div>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Connexion…' : 'Entrer'}</button>
        <p className="muted">Pas encore de compte ? <Link href={`/inscription?next=${encodeURIComponent(next)}`}>Créer un compte</Link></p>
      </form>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="auth-screen"><p>Chargement…</p></main>}><Form /></Suspense>;
}
