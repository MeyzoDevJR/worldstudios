import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <img src="/logo.png" alt="" width="48" height="48" />
          <strong>World Studios</strong>
          <p>Base ESX pour ouvrir un serveur roleplay. Licence à vie, 200 €.</p>
        </div>
        <div className="footer-links">
          <Link href="/acheter">Acheter</Link>
          <Link href="/partenariat">Partenariat</Link>
          <Link href="/inscription">Créer un compte</Link>
          <Link href="/compte">Mon espace</Link>
        </div>
      </div>
      <p className="legal">
        Produit indépendant. FiveM, Rockstar et GTA restent leurs marques. Chaque serveur a besoin de sa propre clé FiveM.
      </p>
    </footer>
  );
}
