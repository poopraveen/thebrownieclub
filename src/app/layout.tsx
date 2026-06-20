import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'The Brownie Club | Artisan Brownies in Bangalore',
  description: 'Handcrafted, rich, decadent brownies baked fresh in Bangalore. Order online for delivery across the city.',
  keywords: 'brownies bangalore, artisan brownies, chocolate brownies, homemade brownies bangalore',
  openGraph: {
    title: 'The Brownie Club',
    description: 'Handcrafted brownies that melt your heart, baked in Bangalore.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#3B1F0E', color: '#FDF6EC', border: '1px solid #C8860A' },
          }}
        />
      </body>
    </html>
  );
}
