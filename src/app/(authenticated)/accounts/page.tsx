import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { UserTable } from '../../../components/accounts/table';

export default async function Accounts() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: users } = await supabase.from('users').select('*');

  if (!users) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các thành viên trong đội bóng.
          </p>
        </div>
      </div>
      <UserTable users={users} />
    </div>
  );
}
