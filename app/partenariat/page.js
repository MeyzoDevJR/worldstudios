'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth, useSound, useToast } from '../../components/state';

export default function PartenariatPage() {
  const { user, ready } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const [form, setForm] = useState({ server_name: '', discord: '', players: '', message: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/partnerships', { method: 'POST', body: form });
      sound.play('success');
      toast('Demande envoyée.');
      setDone(true);
    } catch (err) {
      sound.play('error');
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="auth-screen"><p>Chargement…</p></main>;
  if (!user) {
    return (
      <main className="auth-screen">
        <section className="panel">
          <p className="kicker">Partenariat</p>
          <h1>Un serveur, un accord</h1>
          <p className="muted">Crée d’abord ton compte. La demande reste reliée à ton email.</p>
          <Link className="btn btn-primary" href="/inscription?next=/partenariat">Créer un compte</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-screen">
      <form className="panel" onSubmit={onSubmit} style={{ width: 'min(640px, 100%)' }}>
        <p className="kicker">Partenariat</p>
        <h1>Présente ton serveur</h1>
        <p className="muted">L’équipe lit la demande dans le manager, puis peut t’attribuer une clé 7 jours, 1 mois, 3 mois, 1 an ou à vie.</p>
        {done ? (
          <p>C’est envoyé. Tu verras la réponse dans ton espace.</p>
        ) : (
          <>
            <label className="field"><span>Nom du serveur</span><input required value={form.server_name} onChange={(e) => set('server_name', e.target.value)} /></label>
            <label className="field"><span>Discord</span><input required placeholder="pseudo ou lien" value={form.discord} onChange={(e) => set('discord', e.target.value)} /></label>
            <label className="field"><span>Joueurs visés</span><input value={form.players} onChange={(e) => set('players', e.target.value)} /></label>
            <label className="field"><span>Présentation</span><textarea required minLength={20} value={form.message} onChange={(e) => set('message', e.target.value)} /></label>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer la demande'}</button>
          </>
        )}
      </form>
    </main>
  );
}
