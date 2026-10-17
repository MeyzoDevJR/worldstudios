import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth-screen">
      <section className="panel">
        <p className="kicker">404</p>
        <h1>Page introuvable</h1>
        <p className="muted">Ce lien ne correspond à aucune page du site.</p>
        <Link className="btn btn-primary" href="/">
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}
