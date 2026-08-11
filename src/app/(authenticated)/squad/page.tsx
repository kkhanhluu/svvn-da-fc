import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { SquadTable } from '../../../components/squad/squad-table';

export default async function SquadPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: players } = await supabase.rpc('get_squad_stats');

  return (
    <div className='h-full flex-1 flex-col space-y-8 p-8 md:p-16 flex'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Đội hình</h2>
        <p className='text-muted-foreground'>
          FC SVVN Darmstadt · {players?.length ?? 0} cầu thủ
        </p>
      </div>
      <SquadTable players={players ?? []} />
    </div>
  );
}
