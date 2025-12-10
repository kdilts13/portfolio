import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import SiteNav from '@/app/components/navigation/siteNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Kevin Dilts — Full-Stack Software Engineer',
  description: `Full-stack engineer specializing in modern web apps, cloud-native APIs, and production-grade systems.
    Experienced with Elixir, TypeScript, React, Angular, Java/Spring Boot, and GCP Cloud Run.
    Explore portfolio projects, real infrastructure, and practical tools.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SiteNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
