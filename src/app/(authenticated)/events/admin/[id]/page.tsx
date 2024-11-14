import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../../database.types';
import { EventDetailTableForAdmin } from '../../../../../components/events/event-detail-for-admin-table';
import { TeamAllocation } from '../../../../../components/teams/team-allocation';

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
        'id, irregular_events(id, date, start_time, end_time, description), users(id, first_name, last_name, email, position, score), created_at'
      )
      .eq('irregular_event_id', params.id)
      .order('created_at');
    data = irregularEvent;
    error = irregularEventError;
  } else {
    const { data: regularEvent, error: regularEventError } = await supabase
      .from('events_users')
      .select(
        'id, events(id, date, start_time, end_time, trainings(id, description)), users(id, first_name, last_name, email, position, score), created_at'
      )
      .eq('event_id', params.id)
      .order('created_at');
    data = regularEvent;
    error = regularEventError;
  }

  if (error || data == null) {
    return null;
  }

  return (
    <div className='overflow-y-scroll flex-col space-y-8 md:p-16 md:mt-10 md:flex'>
      <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
      <p className='text-muted-foreground'>Quản lý buổi đá bóng</p>
      <TeamAllocation players={data.map((d) => d.users)} />
      <EventDetailTableForAdmin data={data} />
    </div>
  );
}
