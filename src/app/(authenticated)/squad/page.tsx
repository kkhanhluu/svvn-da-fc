import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { SquadTable } from '../../../components/squad/squad-table';

export default async function SquadPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: players } = await supabase.rpc('get_squad_stats');

  return (
    <div className='flex min-h-full flex-1 flex-col space-y-5 p-5 sm:space-y-8 sm:p-8 md:p-16'>
      <div>
        <h2 className='text-[22px] font-semibold tracking-tight sm:text-2xl sm:font-bold'>
          Đội hình
        </h2>
        <p className='text-[13px] text-muted-foreground sm:text-base'>
          FC SVVN Darmstadt · {players?.length ?? 0} cầu thủ
        </p>
      </div>
      <SquadTable players={players ?? []} />
    </div>
  );
}
