'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Download, KeyRound, LogOut } from 'lucide-react';
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
  const router = useRouter();
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
    if (user.role === 'manager') {
      router.replace('/manager');
      return;
    }
    load().catch((err) => setError(err.message));
  }, [ready, user, router]);

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

  const active = home?.licenses?.find((item) => item.active && !item.revoked);

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

      <div className="account-grid">
        <section className="card account-hero">
          <p className="kicker">Ta licence</p>
          <h2 className="syne" style={{ margin: '6px 0 8px' }}>{active ? active.label : 'Aucune licence active'}</h2>
          {!home?.licenses?.length && <p className="muted">Achète la licence à vie, ou active une clé reçue sur Discord.</p>}
          <div className="stack">
            {home?.licenses?.map((license) => (
              <div key={license.id} className="license-row">
                <div className="keybox">{license.key}</div>
                <div className="license-meta">
                  <span className={`badge ${license.revoked ? 'no' : license.active ? 'ok' : 'wait'}`}>
                    {license.revoked ? 'Révoquée' : license.active ? 'Active' : 'Expirée'}
                  </span>
                  <span className="muted">{license.expires_at ? `Expire le ${when(license.expires_at)}` : 'À vie'}</span>
                  <button className="btn btn-ghost btn-small" onClick={() => copy(license.key)}><Copy size={14} /> Copier</button>
                </div>
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
          <h2 className="syne" style={{ marginTop: 0 }}><KeyRound size={18} /> Activer une clé</h2>
          <p className="muted">Colle une clé reçue par Discord ou par mail. Elle se lie à ce compte.</p>
          <form className="stack" onSubmit={redeem}>
            <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="WS-XXXX-XXXX-XXXX-XXXX" required />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Activation…' : 'Activer'}</button>
          </form>
        </section>
      </div>

      <div className="account-split">
        <section className="card">
          <h2 className="syne" style={{ marginTop: 0 }}>Achats</h2>
          {!home?.purchases?.length && <p className="muted">Pas encore de commande.</p>}
          <div className="stack">
            {home?.purchases?.map((item) => (
              <div key={item.id} className="history-row">
                <div>
                  <strong>{item.reference}</strong>
                  <p className="muted">{when(item.created_at)}</p>
                </div>
                <div className="history-side">
                  <span>{euro(item.amount_cents)}</span>
                  <Badge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="syne" style={{ marginTop: 0 }}>Partenariats</h2>
          {!home?.partnerships?.length && <p className="muted">Aucune demande. <Link href="/partenariat">Déposer un dossier</Link></p>}
          <div className="stack">
            {home?.partnerships?.map((item) => (
              <div key={item.id} className="history-row">
                <div>
                  <strong>{item.server_name}</strong>
                  {item.note && <p className="muted">{item.note}</p>}
                </div>
                <Badge status={item.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
