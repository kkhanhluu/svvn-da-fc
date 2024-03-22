'use client';

import { Calendar, LockKeyhole, LogOut, Settings, User } from 'lucide-react';
import React, { PropsWithChildren } from 'react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { Nav } from './nav';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable';
import { TooltipProvider } from './ui/tooltip';

const LINKS = [
  {
    title: 'Đăng ký',
    icon: Calendar,
    href: '/events',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    href: '/profile',
  },
  {
    title: 'Tài khoản',
    icon: LockKeyhole,
    href: '/settings',
  },
  {
    title: 'Đăng xuất',
    icon: LogOut,
  },
];

interface AuthenticatedLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  user: UserProfile;
}

export function AuthenticatedLayoutComponent({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  user,
  children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const isAdmin = user.role === 'ADMIN';
  const links = isAdmin
    ? [
        {
          title: 'Tài khoản',
          label: '',
          icon: User,
          href: '/accounts',
        },
        ...LINKS,
      ]
    : LINKS;

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
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out'
          )}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
        >
          <Nav isCollapsed={isCollapsed} links={links} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
