import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { EventTable } from '../../../components/events/table';

export default async function EventsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: events } = await supabase.rpc('get_events_for_attendee', {
    attendee_id: user?.id,
  });

  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2 mb-8'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các buổi đá bóng của bạn trong tuần này.
          </p>
        </div>
      </div>
      <EventTable events={events} userId={user?.id ?? ''} />
    </div>
  );
}
