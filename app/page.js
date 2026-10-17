import Link from 'next/link';
import { Box, Car, Gauge, KeyRound, Mic, Shield, ShoppingBag, Tablet, Users, Wrench } from 'lucide-react';
import { Mark } from '../components/Mark';
import { LiveStrip } from '../components/LiveStrip';

const features = [
  { icon: Shield, title: 'ESX Legacy', text: 'Identité, factures, sociétés, statuts et besoins. Le socle roleplay est déjà en place.' },
  { icon: Box, title: 'Inventaire ox', text: 'ox_inventory et ox_lib branchés, avec oxmysql pour la base de données.' },
  { icon: Gauge, title: 'HUD et compteur', text: 'Interface joueur, compteur et écran de chargement dans les couleurs du studio.' },
  { icon: Users, title: 'Menu staff', text: 'Noclip, reports, permissions, gestion du serveur et outils d’administration.' },
  { icon: Tablet, title: 'Tablette gang', text: 'Un outil d’organisation déjà intégré au core, prêt à être configuré.' },
  { icon: Wrench, title: 'Atelier mécano', text: 'Custom véhicule et menu métier, avec le menu F6 des jobs.' },
  { icon: Car, title: 'Véhicules services', text: 'Packs police, EMS et véhicules de base pour lancer la ville.' },
  { icon: Mic, title: 'Voix proximité', text: 'pma-voice est inclus pour les discussions autour du personnage.' },
  { icon: ShoppingBag, title: 'Scripts core', text: 'Création de personnage, vêtements, armes dans le dos, blips et PNJ.' },
];

const included = [
  'ESX Legacy', 'ox_inventory', 'ox_lib', 'oxmysql', 'HUD', 'Compteur', 'Loadscreen',
  'Menu staff', 'Tablette gang', 'Mécano', 'Jobs F6', 'pma-voice', 'Véhicules', 'Notifications',
];

const faqs = [
  ['C’est quoi cette base ?', 'C’est le pack serveur World Studios : framework, interfaces et scripts core pour ouvrir un roleplay FiveM en français.'],
  ['La licence à vie, ça couvre quoi ?', 'Un paiement de 200 €. La clé ne expire pas et les mises à jour publiées par le studio restent téléchargeables depuis ton espace.'],
  ['Comment je reçois les fichiers ?', 'Tu crées un compte, tu paies ou tu fais valider un partenariat, puis la clé apparaît dans ton espace avec le bouton de téléchargement.'],
  ['Je reçois un mail ?', 'Oui. Un mail part à la création du compte, puis un autre quand ta licence est prête.'],
  ['Et si je veux un essai ou un partenariat ?', 'Les durées 7 jours, 1 mois, 3 mois et 1 an se génèrent depuis le Discord de l’équipe. Sur le site, tu déposes une demande de partenariat.'],
  ['Il me faut autre chose pour ouvrir ?', 'Oui : tes propres artifacts FiveM, ta clé Keymaster, et une base MySQL. La licence World Studios ne remplace pas la licence FiveM.'],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <Mark />
          <p className="kicker">serveur officiel de world studios</p>
          <h1>
            Bienvenue
            <span className="line2">
              sur <img className="hero-logo" src="/logo.png" alt="" /> World Studios
            </span>
          </h1>
          <div className="rule" />
          <p className="lead">
            La base ESX du studio, prête à lancer une ville : inventaire, staff, jobs, véhicules et HUD. Une licence à vie, un compte, et la clé arrive par mail.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/acheter">Obtenir la base · 200 €</Link>
            <Link className="btn btn-ghost" href="/partenariat">Demander un partenariat</Link>
          </div>
          <ul className="pills">
            <li>ESX Legacy</li>
            <li>ox_inventory</li>
            <li>Staff</li>
            <li>Roleplay FR</li>
          </ul>
          <LiveStrip />
        </div>
      </section>

      <section className="section" id="base">
        <div className="wrap">
          <div className="section-h">
            <h2>Ce qui tourne déjà dans la base</h2>
            <p className="muted">Tout est rangé pour démarrer un serveur, puis le faire évoluer avec les mises à jour du studio.</p>
          </div>
          <div className="grid-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="card" data-sound-hover="1">
                  <div className="icon-bubble"><Icon size={18} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-h">
            <h2>Dans l’archive</h2>
            <p className="muted">Tu télécharges la dernière version publiée par le manager, tant que ta licence est active.</p>
          </div>
          <div className="chips">
            {included.map((item) => <span key={item} className="chip">{item}</span>)}
          </div>
        </div>
      </section>

      <section className="section" id="licence">
        <div className="wrap price">
          <div>
            <p className="kicker">Licence</p>
            <h2>Un paiement. La base pour de bon.</h2>
            <div className="steps">
              {[
                ['01', 'Compte', 'Email et mot de passe. Le mail de confirmation part tout de suite.'],
                ['02', 'Paiement', '200 € depuis le site, ou une demande de partenariat.'],
                ['03', 'Clé', 'Elle s’affiche dans ton espace et arrive aussi par mail.'],
                ['04', 'Base', 'Tu télécharges l’archive et les mises à jour suivantes.'],
              ].map(([n, title, text]) => (
                <article key={n} className="step">
                  <em>{n}</em>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <article className="price-card" data-sound-hover="1">
            <div className="ribbon">À VIE</div>
            <p className="kicker">Lifetime</p>
            <div className="amount">200 €</div>
            <ul>
              <li>Clé qui n’expire pas</li>
              <li>Téléchargement de la base</li>
              <li>Mises à jour du studio</li>
              <li>Activation sur ton compte</li>
            </ul>
            <Link className="btn btn-primary" href="/acheter">
              <KeyRound size={18} /> Payer la licence
            </Link>
            <p className="muted" style={{ marginTop: 14 }}>
              Les essais et partenariats (7 jours, 1 mois, 3 mois, 1 an) se délivrent avec la commande Discord /genkey.
            </p>
          </article>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 style={{ marginBottom: 18 }}>Questions fréquentes</h2>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
