'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Copy, Download, LogOut } from 'lucide-react';
import { api, downloadBase, euro, when } from '../../lib/api';
import { useAuth, useSound, useToast } from '../../components/state';

function Badge({ status }) {
  const map = {
    paid: ['ok', 'Payé'],
    pending: ['wait', 'En attente'],
    refused: ['no', 'Refusé'],
    accepted: ['ok', 'Accepté'],
  };
  const [kind, label] = map[status] || ['wait', status];
  return <span className={`badge ${kind}`}>{label}</span>;
}

export default function ComptePage() {
  const { user, ready, logout } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const [home, setHome] = useState(null);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api('/api/me/home');
    setHome(data);
  }

  useEffect(() => {
    if (!ready || !user) return;
    load().catch((err) => setError(err.message));
  }, [ready, user]);

  async function redeem(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/licenses/redeem', { method: 'POST', body: { key } });
      sound.play('success');
      toast('Clé activée sur ton compte.');
      setKey('');
      await load();
    } catch (err) {
      sound.play('error');
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function copy(value) {
    await navigator.clipboard.writeText(value);
    sound.play('success');
    toast('Clé copiée.');
  }

  async function download() {
    try {
      await downloadBase();
      sound.play('success');
    } catch (err) {
      sound.play('error');
      toast(err.message, 'bad');
    }
  }

  if (!ready) return <main className="auth-screen"><p>Chargement…</p></main>;
  if (!user) {
    return (
      <main className="auth-screen">
        <section className="panel">
          <h1>Ton espace</h1>
          <p className="muted">Connecte-toi pour voir ta licence et télécharger la base.</p>
          <Link className="btn btn-primary" href="/connexion?next=/compte">Connexion</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap account">
      <div className="head">
        <div>
          <p className="kicker">Espace</p>
          <h1 className="syne" style={{ fontSize: 48, margin: 0, textTransform: 'uppercase' }}>Bonjour {user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <button className="btn btn-ghost" onClick={logout}><LogOut size={16} /> Sortir</button>
      </div>

      <section className="card">
        <h2 className="syne" style={{ marginTop: 0 }}>Licences</h2>
        {!home?.licenses?.length && <p className="muted">Aucune clé pour l’instant. Achète la licence à vie ou active une clé reçue sur Discord.</p>}
        <div className="stack">
          {home?.licenses?.map((license) => (
            <div key={license.id}>
              <div className="keybox">{license.key}</div>
              <p className="muted">
                {license.label} · {license.revoked ? 'Révoquée' : license.active ? 'Active' : 'Expirée'} · {license.expires_at ? `expire le ${when(license.expires_at)}` : 'à vie'}
              </p>
              <button className="btn btn-ghost btn-small" onClick={() => copy(license.key)}><Copy size={14} /> Copier</button>
            </div>
          ))}
        </div>
        <div className="cta-row" style={{ justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" disabled={!home?.canDownload} onClick={download}><Download size={16} /> Télécharger la base</button>
          <Link className="btn btn-ghost" href="/acheter">Acheter · 200 €</Link>
        </div>
        {home?.version && <p className="muted">Version publiée : {home.version.version}. {home.version.changelog}</p>}
      </section>

      <section className="card">
        <h2 className="syne" style={{ marginTop: 0 }}>Activer une clé</h2>
        <p className="muted">Colle une clé reçue par Discord ou par mail. Elle se lie à ce compte.</p>
        <form className="stack" onSubmit={redeem}>
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="WS-XXXX-XXXX-XXXX-XXXX" required />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Activation…' : 'Activer'}</button>
        </form>
      </section>

      <section className="card">
        <h2 className="syne" style={{ marginTop: 0 }}>Achats</h2>
        {!home?.purchases?.length && <p className="muted">Pas encore de commande.</p>}
        {home?.purchases?.map((item) => (
          <p key={item.id}>{item.reference} · {euro(item.amount_cents)} · <Badge status={item.status} /> · {when(item.created_at)}</p>
        ))}
      </section>

      <section className="card">
        <h2 className="syne" style={{ marginTop: 0 }}>Partenariats</h2>
        {!home?.partnerships?.length && <p className="muted">Aucune demande. <Link href="/partenariat">Déposer un dossier</Link></p>}
        {home?.partnerships?.map((item) => (
          <p key={item.id}>{item.server_name} · <Badge status={item.status} /> {item.note && `· ${item.note}`}</p>
        ))}
      </section>
    </main>
  );
}
