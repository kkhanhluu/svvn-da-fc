import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../../database.types';
import { EventDetailTableForAdmin } from '../../../../../components/events/event-detail-for-admin-table';
import { supabase } from '../../../../../helpers/supabase';

export default async function EventForAdminDetail({
  params,
  searchParams: { isIrregular },
}: {
  searchParams: { isIrregular: string };
  params: { id: string; isIrregular: boolean };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  let data: any[] | null = null;
  let error = null;

  if (isIrregular === 'true') {
    const { data: irregularEvent, error: irregularEventError } = await supabase
      .from('events_users')
      .select(
        'id, irregular_events(id, date, start_time, end_time, description), users(id, first_name, last_name, email, position)'
      )
      .eq('irregular_event_id', params.id);
    data = irregularEvent;
    error = irregularEventError;
  } else {
    const { data: regularEvent, error: regularEventError } = await supabase
      .from('events_users')
      .select(
        'id, events(id, date, start_time, end_time, trainings(id, description)), users(id, first_name, last_name, email, position)'
      )
      .eq('event_id', params.id);
    data = regularEvent;
    error = regularEventError;
  }

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
  const { data: regularEvents } = await supabase.rpc('get_events_for_admin');
  const { data: irregularEvents = [] } = await supabase.rpc(
    'get_irregular_events_for_attendee'
  );

  const events = regularEvents
    ?.concat(
      (irregularEvents ?? []).map((event) => ({
        ...event,
        training_id: Number.NEGATIVE_INFINITY,
      }))
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  return (events ?? []).map(({ id, training_id }) => ({
    id: id.toString(),
  }));
}
