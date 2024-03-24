import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { cn } from '../lib/utils';

export function showLoadingToast(message: string) {
  toast({
    className: cn(
      'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
    ),
    description: (
      <div className='flex gap-2 items-center'>
        <Loader2 className='animate-spin' />
        <p className='font-bold'>{message}</p>
      </div>
    ),
  });
}

export function showSuccessToast(message: string) {
  toast({
    className: cn(
      'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
    ),
    description: (
      <div className='flex gap-2 items-center'>
        <CircleCheck className='text-green-600' />
        <p className='font-bold'>{message}</p>
      </div>
    ),
  });
}

export function showErrorToast(message = 'Đã xảy ra lỗi!') {
  toast({
    className: cn(
      'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
    ),
    description: (
      <div className='flex gap-2 items-center'>
        <CircleAlert />
        <p>{message}</p>
      </div>
    ),
    variant: 'destructive',
  });
}
