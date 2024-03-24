'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

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
      <DropdownMenuItem onClick={unregister}>Huỷ đăng ký</DropdownMenuItem>
    );
  } else {
    menuItem = (
      <DropdownMenuItem onClick={register}>Đăng ký tham gia</DropdownMenuItem>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {menuItem}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
