import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../database.types';
import { AddAccountForm } from '../../../../components/accounts/add-account-form';

export default async function AddAccounts() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: trainings } = await supabase.from('trainings').select('*');

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>Hãy tạo thêm thành viên mới</p>
        </div>
      </div>
      <AddAccountForm trainings={trainings ?? []} />
    </div>
  );
}
