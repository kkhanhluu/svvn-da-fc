import { Separator } from '@radix-ui/react-separator';
import { format } from 'date-fns';
import { Notification } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface MailDisplayProps {
  notification: Notification | null;
}

export function NotificationDisplay({ notification }: MailDisplayProps) {
  return (
    <div className='flex h-full flex-col overflow-y-auto'>
      {notification ? (
        <div className='flex flex-1 flex-col'>
          <div className='flex items-start p-4'>
            <div className='flex items-start gap-4 text-sm'>
              <Avatar>
                <AvatarImage alt='test' />
                <AvatarFallback>
                  {'SVVN Darmstadt'
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className='grid gap-1'>
                <div className='font-semibold'>SVVN Darmstadt</div>
                <div className='line-clamp-1 text-xs'>
                  Đội bóng SVVN Darmstadt
                </div>
              </div>
            </div>
            {
              <div className='ml-auto text-xs text-muted-foreground'>
                {format(new Date(notification.created_at), 'PPpp')}
              </div>
            }
          </div>
          <Separator />
          {notification.contain_html_content && notification.text ? (
            <div
              className='flex-1 whitespace-pre-wrap p-4 text-sm'
              dangerouslySetInnerHTML={{ __html: notification.text }}
            />
          ) : (
            <div className='flex-1 whitespace-pre-wrap p-4 text-sm'>
              {notification.text}
            </div>
          )}
        </div>
      ) : (
        <div className='p-8 text-center text-muted-foreground'>
          No message selected
        </div>
      )}
    </div>
  );
}
