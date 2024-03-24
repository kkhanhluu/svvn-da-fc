import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { ProfileForm } from '../../../components/profile/form';

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id ?? '')
    .single();

  if (!currentUser) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <ProfileForm user={currentUser} />
    </div>
  );
}
