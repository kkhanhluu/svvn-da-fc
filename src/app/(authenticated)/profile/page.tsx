import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { ProfileForm } from '../../../components/profile/form';

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: user } = await supabase.from('users').select('*').single();

  if (!user) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <ProfileForm user={user} />
    </div>
  );
}
