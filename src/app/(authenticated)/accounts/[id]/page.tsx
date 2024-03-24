import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../database.types';
import { UpdateAccountForm } from '../../../../components/accounts/update-account-form';
import { supabase } from '../../../../helpers/supabase';

export default async function Accounts() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentUser } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, trainings_users(training_id)')
    .eq('id', user?.id ?? '')
    .single();

  const { data: trainings } = await supabase
    .from('trainings')
    .select('id, description');

  console.log(trainings, currentUser);

  if (!currentUser || !trainings) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>
            Quản lý tài khoản của {currentUser.last_name}{' '}
            {currentUser.first_name}
          </p>
        </div>
      </div>
      <UpdateAccountForm allTrainings={trainings} user={currentUser} />
    </div>
  );
}

export async function generateStaticParams() {
  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();

  return users.map(({ id }) => ({
    id,
  }));
}
