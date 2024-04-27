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
import { EventForAdmin } from '../../../types';
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

export function Actions({ row }: { row: Row<EventForAdmin> }) {
  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  async function deleteEvent() {
    showLoadingToast('Đang huỷ đăng ký...');

    const { error: deleteEventUserError } = await supabase
      .from('events_users')
      .delete()
      .eq('event_id', row.original.id);
    const { error: deleteEventError } = await supabase
      .from('events')
      .delete()
      .eq('id', row.original.id);

    if (deleteEventError || deleteEventUserError) {
      showErrorToast();
    } else {
      showSuccessToast('Đã xóa buổi đá bóng thành công!');
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
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/events/admin/${row.original.id}?isIrregular=${
                  row.original.training_id === Number.NEGATIVE_INFINITY
                }`
              )
            }
          >
            Xem chi tiết
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className='text-red-600 focus:text-white focus:bg-red-500'>
              Xóa buổi đá bóng
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa buổi đá bóng này?</AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi xóa buổi đá bóng, tất cả đăng ký của thành viên cho buổi đá
            bóng này đều bị hủy. Hành động này không thể được hoàn tác
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600' onClick={deleteEvent}>
            Đồng ý
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
