'use client';
import { cn } from '@/lib/utils';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { removeHTMLTags } from '../../helpers/removeHtmlTags';
import { useNotification } from '../../hooks/useNotification';
import { Notification } from '../../types';
import { ScrollArea } from '../ui/scroll-area';

interface NotificationListProps {
  items: Notification[];
}

export function NotificationList({ items }: NotificationListProps) {
  const [notification, setNotification] = useNotification();

  return (
    <ScrollArea className='h-screen'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
        {items.map((item) => {
          let isRead = true;
          if (item.is_important) {
            isRead = false;
          } else if (
            differenceInDays(new Date(), new Date(item.created_at)) <= 7
          ) {
            isRead = false;
          }

          return (
            <button
              key={item.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                notification.selected === item.id && 'bg-muted'
              )}
              onClick={() =>
                setNotification({
                  ...notification,
                  selected: item.id,
                })
              }
            >
              <div className='flex w-full flex-col gap-1'>
                <div className='flex items-center'>
                  <div className='flex items-center gap-2'>
                    <div className='font-semibold'>
                      CLB bóng đá SVVN Darmstadt
                    </div>
                    {!isRead && (
                      <span className='flex h-2 w-2 rounded-full bg-blue-600' />
                    )}
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xs',
                      notification.selected === item.id
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className='text-xs font-medium'>{item.subject}</div>
              </div>
              <div className='line-clamp-2 text-xs text-muted-foreground'>
                {item.contain_html_content
                  ? removeHTMLTags(item.text ?? '').substring(0, 300)
                  : (item.text ?? '').substring(0, 300)}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
