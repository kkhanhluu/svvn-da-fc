'use client';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import { Tabs, TabsContent } from '../ui/tabs';
import { NotificationDisplay } from './notification-display';
import { NotificationList } from './notification-list';

export function Notifications({ data }: { data: any[] }) {
  console.log(data);
  const defaultLayout = [265, 440, 655];
  const navCollapsedSize = 4;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notification] = useNotification();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className='h-full max-h-[800px] items-stretch'
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue='all'>
            <TabsContent value='all' className='m-0'>
              <NotificationList items={data} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <NotificationDisplay
            notification={
              data.find((item) => item.id === notification.selected) || null
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
