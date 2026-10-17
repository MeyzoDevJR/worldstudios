'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Handshake, KeyRound, LayoutDashboard, LogOut, ShoppingBag, Upload, Users } from 'lucide-react';
import { api, apiForm, euro, when } from '../../lib/api';
import { useAuth, useSound, useToast } from '../../components/state';

const tabs = [
  ['overview', 'Vue d’ensemble', LayoutDashboard],
  ['purchases', 'Achats', ShoppingBag],
  ['partnerships', 'Partenariats', Handshake],
  ['licenses', 'Licences', KeyRound],
  ['base', 'Base', Upload],
  ['users', 'Comptes', Users],
];

const plans = [
  ['7j', '7 jours'],
  ['1mois', '1 mois'],
  ['3mois', '3 mois'],
  ['1an', '1 an'],
  ['lifetime', 'À vie'],
];

function Badge({ status }) {
  const map = {
    paid: ['ok', 'Payé'],
    pending: ['wait', 'En attente'],
    refused: ['no', 'Refusé'],
    accepted: ['ok', 'Accepté'],
  };
  const [kind, label] = map[status] || ['wait', status || '—'];
  return <span className={`badge ${kind}`}>{label}</span>;
}

export default function ManagerPage() {
  const { user, ready, logout } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [plan, setPlan] = useState('lifetime');
  const [email, setEmail] = useState('');
  const [freshKey, setFreshKey] = useState('');
  const [version, setVersion] = useState('');
  const [changelog, setChangelog] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const next = await api('/api/manager/bootstrap');
    setData(next);
  }

  useEffect(() => {
    if (!ready || user?.role !== 'manager') return;
    refresh().catch((err) => setError(err.message));
  }, [ready, user]);

  async function act(run, message) {
    try {
      const result = await run();
      sound.play('success');
      toast(message);
      await refresh();
      return result;
    } catch (err) {
      sound.play('error');
      toast(err.message, 'bad');
      return null;
    }
  }

  if (!ready) return <main className="auth-screen"><p>Chargement…</p></main>;
  if (!user) {
    return (
      <main className="auth-screen">
        <section className="panel">
          <h1>Manager</h1>
          <p className="muted">Connecte-toi avec le compte manager.</p>
          <Link className="btn btn-primary" href="/connexion?next=/manager">Connexion</Link>
        </section>
      </main>
    );
  }
  if (user.role !== 'manager') {
    return (
      <main className="auth-screen">
        <section className="panel">
          <h1>Accès réservé</h1>
          <p className="muted">Ce compte n’est pas manager.</p>
          <Link className="btn btn-ghost" href="/compte">Retour à l’espace</Link>
        </section>
      </main>
    );
  }

  const licenses = (data?.licenses || []).filter((item) => {
    const blob = `${item.key} ${item.email} ${item.discord_tag || ''} ${item.plan}`.toLowerCase();
    return blob.includes(filter.toLowerCase());
  });

  return (
    <div className="manager">
      <aside className="side">
        <Link href="/" className="brand" style={{ padding: '4px 8px 12px' }}>
          <img src="/logo.png" alt="" width="36" height="36" />
          <span>Manager</span>
        </Link>
        {tabs.map(([id, label, Icon]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
        <div className="spacer" />
        <p className="quiet muted" style={{ padding: '0 10px', fontSize: 13 }}>{user.email}</p>
        <button onClick={logout}><LogOut size={16} /> Sortir</button>
      </aside>
      <section className="content">
        {error && <p className="error">{error}</p>}
        {!data && !error && <p>Chargement du bureau…</p>}

        {data && tab === 'overview' && (
          <>
            <h1 className="syne" style={{ margin: 0, fontSize: 40, textTransform: 'uppercase' }}>Bureau</h1>
            <div className="stats">
              <article className="stat"><span className="muted">Comptes</span><b>{data.stats.users}</b></article>
              <article className="stat"><span className="muted">Ventes</span><b>{data.stats.paid}</b></article>
              <article className="stat"><span className="muted">Encaissé</span><b>{euro(data.stats.revenue)}</b></article>
              <article className="stat"><span className="muted">Licences actives</span><b>{data.stats.licenses}</b></article>
            </div>
            <div className="grid-3">
              <article className="card"><h3>Achats à valider</h3><p>{data.stats.pendingPurchases}</p></article>
              <article className="card"><h3>Partenariats en attente</h3><p>{data.stats.partnerships}</p></article>
              <article className="card">
                <h3>Lien avec le bot</h3>
                <p>{data.link?.discord ? `Discord ${data.link.tag}` : 'Discord éteint'}</p>
                <p className="muted">
                  {data.link?.commands === 'ok' && 'Les commandes /genkey sont installées. Une clé du site est créée ici, tout de suite.'}
                  {data.link?.commands === 'missing-access' && 'Le bot est en ligne, mais les commandes ne sont pas posées sur le serveur.'}
                  {data.link?.commands === 'off' && 'Ajoute le token Discord dans le .env du bot.'}
                  {data.link?.commands === 'error' && 'Les commandes n’ont pas pu être enregistrées.'}
                </p>
                {data.link?.commands === 'missing-access' && data.link.invite && (
                  <a className="btn btn-ghost btn-small" href={data.link.invite} target="_blank" rel="noreferrer">Inviter le bot</a>
                )}
              </article>
            </div>
          </>
        )}

        {data && tab === 'purchases' && (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Réf</th><th>Compte</th><th>Montant</th><th>État</th><th>Clé</th><th></th></tr></thead>
              <tbody>
                {data.purchases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.reference}<br /><span className="muted">{when(item.created_at)}</span></td>
                    <td>{item.name}<br /><span className="muted">{item.email}</span></td>
                    <td>{euro(item.amount_cents)}</td>
                    <td><Badge status={item.status} /></td>
                    <td>{item.key || '—'}</td>
                    <td className="row-actions">
                      {item.status === 'pending' && (
                        <>
                          <button className="btn btn-primary btn-small" onClick={() => act(() => api(`/api/manager/purchases/${item.id}/confirm`, { method: 'POST', body: {} }), 'Clé créée par le bot.')}>Valider</button>
                          <button className="btn btn-danger btn-small" onClick={() => act(() => api(`/api/manager/purchases/${item.id}/refuse`, { method: 'POST', body: {} }), 'Commande refusée.')}>Refuser</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {!data.purchases.length && <tr><td colSpan="6" className="empty">Aucun achat.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {data && tab === 'partnerships' && (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Serveur</th><th>Contact</th><th>Message</th><th>État</th><th></th></tr></thead>
              <tbody>
                {data.partnerships.map((item) => (
                  <tr key={item.id}>
                    <td>{item.server_name}<br /><span className="muted">{item.players || 'effectif non précisé'}</span></td>
                    <td>{item.name}<br /><span className="muted">{item.email}<br />{item.discord}</span></td>
                    <td style={{ maxWidth: 280 }}>{item.message}</td>
                    <td><Badge status={item.status} /></td>
                    <td className="row-actions">
                      <button className="btn btn-primary btn-small" onClick={() => act(() => api(`/api/manager/partnerships/${item.id}`, { method: 'POST', body: { status: 'accepted' } }), 'Demande acceptée.')}>Accepter</button>
                      <button className="btn btn-danger btn-small" onClick={() => act(() => api(`/api/manager/partnerships/${item.id}`, { method: 'POST', body: { status: 'refused' } }), 'Demande refusée.')}>Refuser</button>
                      <button className="btn btn-ghost btn-small" onClick={async () => {
                        try {
                          const created = await api('/api/manager/licenses', { method: 'POST', body: { email: item.email, plan: 'lifetime' } });
                          setFreshKey(created.license.key);
                          sound.play('success');
                          toast(`Clé créée par le bot : ${created.license.key}`);
                          await refresh();
                        } catch (err) {
                          sound.play('error');
                          toast(err.message, 'bad');
                        }
                      }}>Clé à vie</button>
                    </td>
                  </tr>
                ))}
                {!data.partnerships.length && <tr><td colSpan="5" className="empty">Aucune demande.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {data && tab === 'licenses' && (
          <>
            <form className="card stack" onSubmit={(event) => {
              event.preventDefault();
              act(async () => {
                const created = await api('/api/manager/licenses', { method: 'POST', body: { email, plan } });
                setFreshKey(created.license.key);
                setEmail('');
              }, 'Clé créée par le bot.');
            }}>
              <h2 className="syne" style={{ margin: 0 }}>Générer une clé</h2>
              <div className="grid-3">
                <label className="field"><span>Durée</span>
                  <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    {plans.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                  </select>
                </label>
                <label className="field"><span>Email du compte, si tu veux la lier</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="optionnel" />
                </label>
                <div className="field"><span>&nbsp;</span><button className="btn btn-primary">Générer</button></div>
              </div>
              {freshKey && <div className="keybox">{freshKey}</div>}
            </form>
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrer une clé, un email, un pseudo Discord" />
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Clé</th><th>Durée</th><th>Compte</th><th>Discord</th><th>État</th><th></th></tr></thead>
                <tbody>
                  {licenses.map((item) => (
                    <tr key={item.id}>
                      <td>{item.key}<br /><span className="muted">{item.created_by} · {when(item.created_at)}</span></td>
                      <td>{item.label}<br /><span className="muted">{item.expires_at ? when(item.expires_at) : 'À vie'}</span></td>
                      <td>{item.email}</td>
                      <td>{item.discord_tag || '—'}</td>
                      <td>{item.revoked ? <Badge status="refused" /> : item.active ? <span className="badge ok">Active</span> : <span className="badge wait">Expirée</span>}</td>
                      <td>{!item.revoked && <button className="btn btn-danger btn-small" onClick={() => act(() => api(`/api/manager/licenses/${item.id}/revoke`, { method: 'POST', body: {} }), 'Clé révoquée.')}>Révoquer</button>}</td>
                    </tr>
                  ))}
                  {!licenses.length && <tr><td colSpan="6" className="empty">Aucune licence.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {data && tab === 'base' && (
          <div className="split" style={{ display: 'grid', gap: 16 }}>
            <form className="card stack" onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              const form = new FormData();
              form.set('version', version);
              form.set('changelog', changelog);
              if (url) form.set('url', url);
              if (file) form.set('file', file);
              const result = await act(() => apiForm('/api/manager/base', form), 'Base publiée.');
              if (result) {
                setVersion('');
                setChangelog('');
                setUrl('');
                setFile(null);
                event.target.reset();
              }
              setBusy(false);
            }}>
              <h2 className="syne" style={{ margin: 0 }}>Publier une mise à jour</h2>
              <p className="muted">Zip de la base, ou un lien (Drive, hébergeur). Les comptes avec une licence active pourront la télécharger. Retire ta clé FiveM, ta clé Steam et le mot de passe MySQL du server.cfg avant d’envoyer l’archive.</p>
              <label className="field"><span>Version</span><input required value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" /></label>
              <label className="field"><span>Journal</span><textarea value={changelog} onChange={(e) => setChangelog(e.target.value)} placeholder="Ce qui change dans cette version" /></label>
              <label className="field"><span>Fichier .zip</span><input type="file" accept=".zip" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
              <label className="field"><span>Ou un lien https</span><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></label>
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Envoi…' : 'Publier'}</button>
            </form>
            <div className="stack">
              {data.versions.map((item) => (
                <article key={item.id} className="card">
                  <strong>v{item.version}</strong>
                  <p className="muted">{when(item.created_at)} · {item.kind}</p>
                  <p>{item.changelog || 'Sans journal.'}</p>
                </article>
              ))}
              {!data.versions.length && <p className="empty">Aucune version publiée.</p>}
            </div>
          </div>
        )}

        {data && tab === 'users' && (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Licences</th><th>Créé</th></tr></thead>
              <tbody>
                {data.users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role === 'manager' ? 'Manager' : 'Joueur'}</td>
                    <td>{item.licenses}</td>
                    <td>{when(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
