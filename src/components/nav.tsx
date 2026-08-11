'use client';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Calendar,
  CalendarPlus,
  ChevronsUpDown,
  LockKeyhole,
  LogOut,
  LucideIcon,
  Mail,
  MoonIcon,
  Settings,
  SunIcon,
  Trophy,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { getFullName } from '../helpers/playerName';
import { UserProfile } from '../types';
import { PlayerAvatar } from './player-avatar';
import { buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

interface NavProps {
  user: UserProfile;
}

// Đăng ký/Giải đấu/Đội hình are what members check day to day; Thông báo is
// a secondary feed, so it sits last in this group instead of first.
const USER_LINKS = [
  {
    title: 'Đăng ký',
    icon: Calendar,
    href: '/events',
  },
  {
    title: 'Giải đấu',
    icon: Trophy,
    href: '/competitions',
    matchNestedRoutes: true,
  },
  {
    title: 'Đội hình',
    icon: Users,
    href: '/squad',
    matchNestedRoutes: true,
  },
  {
    title: 'Thông báo',
    icon: Mail,
    href: '/notification',
  },
];

// Account-level actions, grouped inside the account menu below.
const ACCOUNT_LINKS = [
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
];

const ADMIN_LINKS = [
  {
    title: 'Thêm Tài khoản',
    label: '',
    icon: UserPlus,
    href: '/accounts/new',
  },
  {
    title: 'Tài khoản',
    label: '',
    icon: User,
    href: '/accounts',
  },
  {
    title: 'Buổi đá bóng',
    label: '',
    icon: CalendarPlus,
    href: '/events/admin',
  },
];

export function Nav({ user }: NavProps) {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className='group flex h-full flex-col gap-4 py-2 data-[collapsed=true]:py-2'>
      <nav className='grid gap-1 overflow-y-auto px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {isAdmin ? (
          <>
            {ADMIN_LINKS.map((link, index) => (
              <NavItemLink link={link} key={index} />
            ))}
            <br />
            <Separator />
            <br />
          </>
        ) : null}
        {USER_LINKS.map((link, index) => (
          <NavItemLink link={link} key={index} />
        ))}
      </nav>

      {/* mt-auto pins this to the bottom of the panel now that the panel
          above (see authenticatedLayoutComponent) has a real, fixed height. */}
      <div className='mt-auto px-2'>
        <Separator className='mb-2' />
        <AccountMenu user={user} isAdmin={isAdmin} />
      </div>
    </div>
  );
}

function AccountMenu({
  user,
  isAdmin,
}: {
  user: UserProfile;
  isAdmin: boolean;
}) {
  const { setTheme, theme } = useTheme();
  const supabase = createClientComponentClient();
  const router = useRouter();

  const displayName = getFullName(user) || user.email || 'Tài khoản';

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground'
        >
          <PlayerAvatar
            name={displayName}
            avatarUrl={user.avatar_url}
            className='h-8 w-8 flex-none'
          />
          <span className='hidden min-w-0 flex-1 flex-col items-start text-left md:flex'>
            <span className='w-full truncate font-medium'>
              {displayName}
            </span>
            <span className='w-full truncate text-xs text-muted-foreground'>
              {user.email}
            </span>
          </span>
          <ChevronsUpDown className='hidden h-4 w-4 flex-none text-muted-foreground md:block' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='top' align='start' className='w-64'>
        <DropdownMenuLabel className='font-normal'>
          <p className='truncate text-sm font-medium'>{user.email}</p>
          <p className='text-xs text-muted-foreground'>
            {isAdmin ? 'Quản trị viên hệ thống' : 'Thành viên'}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ACCOUNT_LINKS.map((link) => (
          <DropdownMenuItem asChild key={link.href} className='cursor-pointer'>
            <Link href={link.href} className='flex items-center gap-2'>
              <link.icon className='h-4 w-4' />
              {link.title}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          // Toggling the theme shouldn't dismiss the menu the way navigating
          // away does — the user is likely to check both modes in a row.
          onSelect={(event) => {
            event.preventDefault();
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
          className='flex cursor-pointer items-center gap-2'
        >
          <SunIcon className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <MoonIcon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={signOut}
          className='flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive'
        >
          <LogOut className='h-4 w-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavItemLink({
  link,
}: {
  link: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href?: string;
    matchNestedRoutes?: boolean;
  };
}) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Competitions and squad have detail pages, so they stay highlighted while
  // browsing a match or a player. The other links have no nested routes.
  const isCurrentPath =
    pathname === link.href ||
    (link.matchNestedRoutes === true &&
      link.href != null &&
      pathname.startsWith(`${link.href}/`));
  const variant = isCurrentPath ? 'default' : 'ghost';

  if (isMobile) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={link.href ?? '#'}
            className={cn(
              buttonVariants({
                variant,
                size: 'icon',
              }),
              'h-9 w-9',
              isCurrentPath &&
                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
            )}
          >
            <link.icon className='h-4 w-4' />
            <span className='sr-only'>{link.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4'>
          {link.title}
          {link.label && (
            <span className='ml-auto text-muted-foreground'>{link.label}</span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={link.href ?? '#'}
      className={cn(
        buttonVariants({ variant, size: 'lg' }),
        isCurrentPath &&
          'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
        'justify-start'
      )}
    >
      <link.icon className='mr-2 h-4 w-4' />
      {link.title}
    </Link>
  );
}
