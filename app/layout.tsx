import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from './providers/redux-provider';
import ThemeWrapper from './providers/theme-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer - Real-time 3D Network Monitoring',
  description: 'Interactive 3D visualization of cryptocurrency exchange server latency across AWS, GCP, and Azure cloud providers. Monitor real-time network performance and historical trends.',
  keywords: 'latency, topology, cryptocurrency, exchanges, cloud, AWS, GCP, Azure, network monitoring, 3D visualization',
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
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