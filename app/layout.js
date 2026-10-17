import './globals.css';
import { Outfit, Syne } from 'next/font/google';
import { Providers } from '../components/Providers';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['600', '700', '800'] });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300', '400', '500', '600', '700'] });

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
    <html lang="fr" className={`${syne.variable} ${outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
