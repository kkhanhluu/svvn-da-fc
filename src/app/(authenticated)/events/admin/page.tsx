import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../../database.types';
import { EventTableForAdmin } from '../../../../components/events/admin-table';

export default async function EventsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: events } = await supabase.rpc('get_events_for_admin');

  if (!events) {
    return null;
  }

  const { data: attendees } = await supabase
    .from('events_users')
    .select('id, event_id, user_id')
    .in('event_id', events?.map(({ id }) => id) ?? []);

  const eventsWithAttendees = events?.map((event) => {
    const eventAttendees = attendees?.filter(
      (attendee) => attendee.event_id === event.id
    );

    return {
      ...event,
      attendees: eventAttendees?.map(({ user_id }) => user_id) ?? [],
    };
  });

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2 mb-8'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các buổi đá bóng của đội bóng SVVN Darmstadt trong
            tuần này.
          </p>
        </div>
      </div>
      <EventTableForAdmin events={eventsWithAttendees} />
    </div>
  );
}
