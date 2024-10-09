'use client';

import { PropsWithChildren } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { Nav } from './nav';
import { TooltipProvider } from './ui/tooltip';

interface AuthenticatedLayoutProps {
  user: UserProfile;
}

export function AuthenticatedLayoutComponent({
  user,
  children,
}: PropsWithChildren<AuthenticatedLayoutProps>) {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <PanelGroup
          direction='horizontal'
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`;
          }}
          className='h-full flex-1 items-stretch'
        >
          <Panel
            defaultSize={265}
            collapsible={true}
            minSize={15}
            maxSize={20}
            className={cn(
              'md:min-w-[50px] transition-all duration-300 ease-in-out'
            )}
          >
            <Nav isAdmin={isAdmin} />
          </Panel>
          <Panel defaultSize={422}>{children}</Panel>
        </PanelGroup>
      </TooltipProvider>
    </div>
  );
}
