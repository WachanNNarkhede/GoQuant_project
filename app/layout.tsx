import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from './providers/redux-provider';
import ThemeWrapper from './providers/theme-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer',
  description: '3D visualization of exchange server locations and latency data across cloud providers',
  keywords: 'latency, topology, cryptocurrency, exchanges, cloud, AWS, GCP, Azure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <ReduxProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}