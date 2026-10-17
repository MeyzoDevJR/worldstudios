import './globals.css';
import { Providers } from '../components/Providers';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'World Studios', template: '%s · World Studios' },
  description: 'Base ESX World Studios. Licence à vie à 200 €, création de compte, paiement et demandes de partenariat.',
  openGraph: {
    title: 'World Studios',
    description: 'La base ESX prête à lancer ton serveur.',
    images: ['/banner.jpg'],
  },
};

export const viewport = {
  themeColor: '#07140e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" style={{ '--font-syne': '"Syne", sans-serif', '--font-outfit': '"Outfit", sans-serif' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
