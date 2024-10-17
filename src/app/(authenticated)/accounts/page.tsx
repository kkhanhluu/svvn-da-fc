import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { UserTable } from '../../../components/accounts/table';

export default async function Accounts({
  searchParams: { training_id },
}: {
  searchParams: { training_id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const query = supabase
    .from('trainings_users')
    .select('training_id, users(*)');

  if (training_id) {
    query.eq('training_id', training_id);
  }

  const { data: trainingUsers } = await query;

  const userMap = new Map();
  trainingUsers?.forEach((t) => {
    if (t.users != null) {
      userMap.set(t.users?.id, t.users);
    }
  });

  const users = Array.from(userMap.values());
  if (!users.length) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-16 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các thành viên trong đội bóng.
          </p>
        </div>
      </div>

      <UserTable users={users} training_id={training_id} />
    </div>
  );
}
