import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../../database.types';
import { EventDetailTableForAdmin } from '../../../../../components/events/event-detail-for-admin-table';
import { supabase } from '../../../../../helpers/supabase';

export default async function EventForAdminDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .from('events_users')
    .select(
      'id, events(id, date, start_time, end_time, attendees, trainings(id, description)), users(id, first_name, last_name, email, position)'
    )
    .eq('event_id', params.id);

  if (error || data == null) {
    return null;
  }

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>Quản lý buổi đá bóng</p>
        </div>
      </div>
      <EventDetailTableForAdmin data={data} />
    </div>
  );
}

export async function generateStaticParams() {
  const { data: events } = await supabase.rpc('get_events_for_admin');

  return (events ?? []).map(({ id }) => ({
    id: id.toString(),
  }));
}
