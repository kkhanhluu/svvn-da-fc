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
  return (
    <div className='h-screen overflow-hidden'>
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
              'max-w-[50px] md:max-w-[250px] transition-all duration-300 ease-in-out'
            )}
          >
            <Nav user={user} />
          </Panel>
          <Panel defaultSize={422}>
            {/* The panel itself clips overflow (its own inline style, so a
                class on the panel can't override it) — this inner box is
                what actually scrolls, keeping the sidebar and the account
                menu pinned to its bottom on screen regardless of page length. */}
            <div className='h-full overflow-y-auto'>{children}</div>
          </Panel>
        </PanelGroup>
      </TooltipProvider>
    </div>
  );
}
