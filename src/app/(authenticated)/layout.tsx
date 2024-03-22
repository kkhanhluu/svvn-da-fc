import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { AuthenticatedLayoutComponent } from '../../components/authenticatedLayoutComponent';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const supabase = createServerComponentClient({ cookies });

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .single();

  if (!currentUser) {
    return redirect('/login');
  }

  // Lud^tq73Tj36
  return (
    <AuthenticatedLayoutComponent
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
      user={currentUser}
    >
      {children}
    </AuthenticatedLayoutComponent>
  );
}
