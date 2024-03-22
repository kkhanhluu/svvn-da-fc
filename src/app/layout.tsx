import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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
        <div className='container relative'>
          <div className='overflow-hidden mt-[10vh] min-h-[80vh] rounded-[0.5rem] border bg-background shadow-md md:shadow-xl'>
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
