'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Database } from '../../../../database.types';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../../helpers/showNotifications';
import { EventWithTraining } from '../../../types';
import { Button } from '../../ui/button';

export function Actions({
  row,
  userId,
}: {
  row: Row<EventWithTraining>;
  userId: string;
}) {
  const router = useRouter();

  const supabase = createClientComponentClient<Database>();
  const attendees = row.original.attendees as string[];
  const alreadyRegistered = attendees.indexOf(userId) >= 0;

  async function register() {
    showLoadingToast('Đang đăng ký...');
    if (alreadyRegistered) {
      return;
    }

    if (attendees.length >= row.original.max_attendees) {
      return;
    }

    const updatedAttendees = new Set([...attendees, userId]);
    const { error } = await supabase
      .from('events')
      .update({ attendees: Array.from(updatedAttendees) })
      .eq('id', row.original.id);
    const { error: insertError } = await supabase
      .from('events_users')
      .insert({ event_id: row.original.id, user_id: userId });

    if (error || insertError) {
      showErrorToast();
    } else {
      showSuccessToast('Đăng ký thành công');
      router.refresh();
    }
  }

  async function unregister() {
    showLoadingToast('Đang huỷ đăng ký...');

    if (!alreadyRegistered) {
      return;
    }

    const updatedAttendees = attendees.filter((id) => id !== userId);
    const { error } = await supabase
      .from('events')
      .update({ attendees: updatedAttendees })
      .eq('id', row.original.id);
    const { error: insertError } = await supabase
      .from('events_users')
      .delete()
      .eq('event_id', row.original.id)
      .eq('user_id', userId);

    if (error || insertError) {
      showErrorToast();
    } else {
      showSuccessToast('Huỷ đăng ký thành công');
      router.refresh();
    }
  }

  let menuItem;
  if (alreadyRegistered) {
    menuItem = (
      <Button
        variant='default'
        size='sm'
        className='mt-2 text-xs bg-red-600 text-xs hover:bg-red-700'
        onClick={unregister}
      >
        Huỷ đăng ký
      </Button>
    );
  } else {
    menuItem = (
      <Button
        variant='default'
        size='sm'
        className='mt-2 bg-green-600 text-xs hover:bg-green-700'
        disabled={attendees.length >= row.original.max_attendees}
        onClick={register}
      >
        Đăng ký tham gia
      </Button>
    );
  }

  return menuItem;
}
