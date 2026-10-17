'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useSound, useToast } from '../../components/state';

function Form() {
  const { register } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get('next') || '/compte';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/compte';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirm) {
      sound.play('error');
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password });
      sound.play('success');
      toast(data.mailSent ? 'Compte créé. Le mail de confirmation est parti.' : 'Compte créé. Le mail partira dès que l’envoi sera configuré.');
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
        <p className="kicker">Nouveau joueur</p>
        <h1>Créer un compte</h1>
        <p className="muted">Un mail part pour confirmer que le compte est bien créé.</p>
        <label className="field">
          <span>Nom</span>
          <input required minLength={2} maxLength={40} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <div className="pass">
            <input type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={form.password} onChange={(e) => set('password', e.target.value)} />
            <button type="button" data-sound="off" onClick={() => setShow((v) => !v)}>{show ? 'Cacher' : 'Voir'}</button>
          </div>
        </label>
        <label className="field">
          <span>Confirmer</span>
          <input type={show ? 'text' : 'password'} required minLength={8} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Création…' : 'Créer mon compte'}</button>
        <p className="muted">Déjà inscrit ? <Link href={`/connexion?next=${encodeURIComponent(next)}`}>Se connecter</Link></p>
      </form>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="auth-screen"><p>Chargement…</p></main>}><Form /></Suspense>;
}
