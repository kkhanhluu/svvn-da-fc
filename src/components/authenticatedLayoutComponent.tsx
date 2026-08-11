'use client';

import { PropsWithChildren } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { MobileTabBar } from './mobile-tab-bar';
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
    // 100dvh, not 100vh: on mobile Safari 100vh is the toolbar-less height, so
    // the last ~100px of the scroll area sat behind the browser chrome and
    // could never be scrolled into view.
    <div className='h-[100dvh] overflow-hidden'>
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
          {/* Phones get the bottom tab bar below instead of the sidebar. */}
          <Panel
            defaultSize={265}
            collapsible={true}
            minSize={15}
            maxSize={20}
            className={cn(
              'hidden md:block',
              'max-w-[50px] md:max-w-[250px] transition-all duration-300 ease-in-out'
            )}
          >
            <Nav user={user} />
          </Panel>
          <Panel defaultSize={422}>
            {/* The panel itself clips overflow (its own inline style, so a
                class on the panel can't override it) — this inner box is
                what actually scrolls, keeping the sidebar and the account
                menu pinned to its bottom on screen regardless of page length.
                The bottom padding clears the mobile tab bar, whose own height
                grows with the device's safe area. */}
            <div className='h-full overflow-y-auto pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0'>
              {children}
            </div>
          </Panel>
        </PanelGroup>
        <MobileTabBar user={user} />
      </TooltipProvider>
    </div>
  );
}
