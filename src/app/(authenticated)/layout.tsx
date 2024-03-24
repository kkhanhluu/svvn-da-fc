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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single();

  if (!currentUser) {
    return redirect('/login');
  }

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
