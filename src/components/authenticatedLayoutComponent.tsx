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
    // Desktop pins the shell to the viewport so the sidebar stays put while the
    // content panel scrolls. A phone must NOT do that: an inner scroll box
    // inside a viewport-height container never lets Safari collapse its
    // toolbars, so its last screenful stays behind the browser chrome and only
    // appears while you hold an overscroll. Below `md` the document scrolls.
    <div className='md:h-[100dvh] md:overflow-hidden'>
      <TooltipProvider delayDuration={0}>
        <PanelGroup
          direction='horizontal'
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`;
          }}
          className='flex-1 items-stretch md:h-full'
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
            {/* On desktop the panel itself clips overflow (its own inline
                style, so a class on the panel can't override it) — this inner
                box is what actually scrolls, keeping the sidebar and the
                account menu pinned to its bottom on screen regardless of page
                length. On a phone it is a plain block and the padding clears
                the fixed tab bar. */}
            <div className='pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:h-full md:overflow-y-auto md:pb-0'>
              {children}
            </div>
          </Panel>
        </PanelGroup>
        <MobileTabBar user={user} />
      </TooltipProvider>
    </div>
  );
}
