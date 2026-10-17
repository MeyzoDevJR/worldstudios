import Link from 'next/link';

export const metadata = { title: 'Paiement annulé' };

export default function AnnulePage() {
  return (
    <main className="auth-screen">
      <section className="panel">
        <p className="kicker">Paiement</p>
        <h1>Paiement annulé</h1>
        <p className="muted">Aucune somme n’a été encaissée. Tu peux relancer quand tu veux.</p>
        <Link className="btn btn-primary" href="/acheter">Revenir à la licence</Link>
      </section>
    </main>
  );
}
