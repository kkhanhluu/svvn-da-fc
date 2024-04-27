import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { AlertCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { EventTable } from '../../../components/events/table';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';

export default async function EventsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return null;
  }

  const { data: regularEvents = [] } = await supabase.rpc(
    'get_events_for_attendee',
    {
      attendee_id: user?.id,
    }
  );

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

  if (!events) {
    return null;
  }

  const regularEventIds = (regularEvents ?? []).map(({ id }) => id).join(',');
  const irregularEventIds = (irregularEvents ?? [])
    .map(({ id }) => id)
    .join(',');

  const { data: attendees } = await supabase
    .from('events_users')
    .select('id, event_id, irregular_event_id, user_id')
    .or(
      `event_id.in.(${regularEventIds}),irregular_event_id.in.(${irregularEventIds})`
    );

  const eventsWithAttendees = events?.map((event) => {
    const eventAttendees = attendees?.filter(
      (attendee) =>
        attendee.event_id === event.id ||
        attendee.irregular_event_id === event.id
    );

    return {
      ...event,
      attendees: eventAttendees?.map(({ user_id }) => user_id) ?? [],
    };
  });

  return (
    <div className='hidden overflow-y-scroll h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Nội quy đội bóng FC SVVN Darmstadt</AlertTitle>
        <AlertDescription>
          <h4>Tham Gia Buổi Đá Bóng:</h4>
          <ul>
            <li>
              &#8226; Các thành viên chỉ được tham gia buổi đá bóng khi đã đăng
              ký thành công.
            </li>
            <li>
              &#8226; Nếu đã đăng ký nhưng không tham gia, sẽ bị tính là một lần
              vi phạm.
            </li>
            <li>
              &#8226; Thời gian hủy đăng ký là ít nhất 2 tiếng trước khi trận
              đấu bắt đầu và phải thông báo trên nhóm chat.
            </li>
          </ul>

          <h4>Thời Gian Xuất Hiện:</h4>
          <ul>
            <li>
              &#8226; Các thành viên phải có mặt đúng giờ trước thời gian trận
              đấu bắt đầu ít nhất 5 phút.
            </li>
            <li>
              &#8226; Trong trường hợp thành viên bị trễ do tàu delay/cancel,
              thành viên phải capture thời gian trễ và thông báo vào nhóm chat
              của đội.
            </li>
            <li>&#8226; Mỗi lần muộn sẽ bị tính là một lần vi phạm.</li>
          </ul>

          <h4>Bê Gôn:</h4>
          <ul>
            <li>
              &#8226; 4 thành viên bất kỳ sẽ được thông báo trước trận cất gôn
              trước (nếu cần) và sau khi trận đấu kết thúc.
            </li>
            <li>&#8226; Không thực hiện sẽ được tính là một lần vi phạm.</li>
          </ul>

          <h4>Ghi Nhớ Đội:</h4>
          <ul>
            <li>
              &#8226; Sau khi chia đội trước mỗi trận đấu, mỗi thành viên cần
              ghi nhớ mình thuộc đội nào để tránh nhầm lẫn và tiết kiệm thời
              gian.
            </li>
          </ul>
          <h4>Quy Định Phạt:</h4>
          <ul>
            <li>&#8226; Vi phạm lần đầu sẽ nhận cảnh cáo.</li>
            <li>
              &#8226; Vi phạm lần thứ hai sẽ bị phạt không được tham gia một
              trận đấu.
            </li>
            <li>
              &#8226; Vi phạm lần thứ ba sẽ bị phạt không được tham gia hai trận
              đấu, và cứ tiếp tục như vậy với mỗi lần vi phạm tiếp theo.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className='flex items-center justify-between space-y-2 mb-8'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các buổi đá bóng của bạn trong tuần này.
          </p>
        </div>
      </div>
      <EventTable events={eventsWithAttendees} userId={user?.id ?? ''} />
    </div>
  );
}
