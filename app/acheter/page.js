'use client';

import Link from 'next/link';
import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth, useSound, useToast } from '../../components/state';

export default function AcheterPage() {
  const { user, ready } = useAuth();
  const toast = useToast();
  const sound = useSound();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState(null);

  async function pay() {
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/purchases/checkout', { method: 'POST', body: {} });
      if (data.mode === 'stripe' && data.url) {
        window.location.href = data.url;
        return;
      }
      sound.play('success');
      setManual(data);
      toast('Commande enregistrée.');
    } catch (err) {
      sound.play('error');
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <main className="auth-screen"><p>Chargement…</p></main>;

  return (
    <main className="auth-screen">
      <section className="panel price-card" style={{ width: 'min(560px, 100%)' }}>
        <p className="kicker">Licence à vie</p>
        <h1>World Studios</h1>
        <div className="amount">200 €</div>
        <p className="muted">Paiement unique. La clé se lie à ton compte et part aussi par mail. Les mises à jour restent téléchargeables.</p>
        {!user && (
          <Link className="btn btn-primary" href="/inscription?next=/acheter">Créer un compte pour payer</Link>
        )}
        {user && !manual && (
          <button className="btn btn-primary" disabled={busy} onClick={pay}>
            <KeyRound size={18} /> {busy ? 'Ouverture…' : 'Payer 200 €'}
          </button>
        )}
        {error && <p className="error">{error}</p>}
        {manual && (
          <div className="stack">
            <p>Commande <strong>{manual.reference}</strong> enregistrée pour {manual.amount} €.</p>
            <p className="muted">
              {manual.instructions || 'Le manager valide le règlement, puis la clé arrive dans ton espace et par mail.'}
            </p>
            <Link className="btn btn-ghost" href="/compte">Voir mon espace</Link>
          </div>
        )}
        <p className="muted">Tu préfères un accord ? <Link href="/partenariat">Demande un partenariat</Link>.</p>
      </section>
    </main>
  );
}
