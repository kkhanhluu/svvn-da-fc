import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cookies } from 'next/headers';
import AuthProvider from '../components/auth/authProvider';
import { Toaster } from '../components/ui/toaster';
import { cn } from '../lib/utils';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CLB bóng đá Darmstadt',
  description: 'CLB bóng đá Darmstadt',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Analytics />
        <div className='container max-w-[90vw] relative'>
          <div className='mt-[5vh] flex h-[90vh] rounded-[0.5rem] border bg-background shadow-md md:shadow-xl'>
            <AuthProvider accessToken={session?.access_token}>
              {children}
            </AuthProvider>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
