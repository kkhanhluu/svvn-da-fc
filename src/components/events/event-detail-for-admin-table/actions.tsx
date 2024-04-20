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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export function Actions({ row }: { row: Row<any> }) {
  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  async function deleteRegistration() {
    showLoadingToast('Đang huỷ đăng ký...');

    const { error: deleteEventUserError } = await supabase
      .from('events_users')
      .delete()
      .eq('id', row.original.id);

    const updatedAttendees = row.original.filter(
      (attendee: any) => attendee !== row.original.users.id
    );
    const { error: updateEventError } = await supabase
      .from('events')
      .update({ attendees: updatedAttendees })
      .eq('id', row.original.events.id);

    if (deleteEventUserError || updateEventError) {
      showErrorToast();
    } else {
      showSuccessToast('Đã xóa đăng ký thành công!');
      router.refresh();
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className='text-red-600 focus:text-white focus:bg-red-500'>
              Xóa đăng ký
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có muốn xóa đăng ký cho {row.original.last_name}{' '}
            {row.original.first_name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi xóa đăng ký, hành động này không thể được hoàn tác
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600'
            onClick={deleteRegistration}
          >
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
