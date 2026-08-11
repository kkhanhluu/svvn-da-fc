'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { AccountMenuContent, USER_LINKS } from './nav';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';

// Notifications lose their tab to the account menu: four targets is what fits
// a phone comfortably, and the other three are the day-to-day destinations.
const TAB_LINKS = USER_LINKS.filter((link) => link.href !== '/notification');

const TAB_CLASSES =
  'flex h-full flex-col items-center justify-start gap-[5px] py-2 text-[11px]';

function isActive(pathname: string, link: (typeof TAB_LINKS)[number]): boolean {
  return (
    pathname === link.href ||
    (link.matchNestedRoutes === true && pathname.startsWith(`${link.href}/`))
  );
}

/**
 * Phone navigation: the sidebar is hidden below `md`, so these four targets —
 * three pages plus the account menu — replace it.
 */
export function MobileTabBar({ user }: { user: UserProfile }) {
  const pathname = usePathname();
  const isAdmin = user.role === 'ADMIN';

  const isAccountRoute = ['/profile', '/settings', '/notification', '/accounts'].some(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );

  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background px-2 pt-2 pb-[max(22px,env(safe-area-inset-bottom))] md:hidden'>
      {TAB_LINKS.map((link) => {
        const active = isActive(pathname, link);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              TAB_CLASSES,
              active
                ? 'font-semibold text-foreground'
                : 'font-medium text-muted-foreground'
            )}
          >
            <link.icon className='h-[22px] w-[22px]' />
            {link.title}
          </Link>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            TAB_CLASSES,
            isAccountRoute
              ? 'font-semibold text-foreground'
              : 'font-medium text-muted-foreground'
          )}
        >
          <User className='h-[22px] w-[22px]' />
          Tài khoản
        </DropdownMenuTrigger>
        <AccountMenuContent
          user={user}
          isAdmin={isAdmin}
          align='end'
          showSecondaryLinks
        />
      </DropdownMenu>
    </nav>
  );
}
