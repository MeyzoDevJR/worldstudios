'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useSound } from '../../../components/state';

function Result() {
  const params = useSearchParams();
  const sound = useSound();
  const [status, setStatus] = useState('verification');
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (!sessionId) {
      setStatus('missing');
      return;
    }
    api('/api/purchases/sync', { method: 'POST', body: { sessionId } })
      .then((data) => {
        setStatus(data.status);
        if (data.status === 'paid') sound.play('success');
      })
      .catch((err) => setError(err.message));
  }, [params, sound]);

  return (
    <main className="auth-screen">
      <section className="panel">
        <p className="kicker">Paiement</p>
        <h1>{status === 'paid' ? 'C’est payé' : 'Paiement reçu'}</h1>
        {error && <p className="error">{error}</p>}
        {!error && status !== 'paid' && <p className="muted">On confirme la commande. La clé apparaît dans ton espace dans un instant.</p>}
        {status === 'paid' && <p className="muted">Ta licence à vie est sur ton compte. Le mail avec la clé est parti.</p>}
        <Link className="btn btn-primary" href="/compte">Ouvrir mon espace</Link>
      </section>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<main className="auth-screen"><p>Confirmation…</p></main>}><Result /></Suspense>;
}
