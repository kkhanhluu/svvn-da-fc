'use client';

import {
  Calendar,
  LockKeyhole,
  LogOut,
  LucideIcon,
  Settings,
  User,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from './ui/button';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface NavProps {
  isCollapsed: boolean;
  isAdmin: boolean;
}

const USER_LINKS = [
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
];

export function Nav({ isCollapsed, isAdmin }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {isAdmin ? (
          <>
            {ADMIN_LINKS.map((link, index) => (
              <NavItemLink link={link} isCollapsed={isCollapsed} key={index} />
            ))}
            <br />
            <Separator />
            <br />
          </>
        ) : null}
        {USER_LINKS.map((link, index) => (
          <NavItemLink link={link} isCollapsed={isCollapsed} key={index} />
        ))}
      </nav>
    </div>
  );
}

function NavItemLink({
  link,
  isCollapsed,
}: {
  link: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href?: string;
  };
  isCollapsed: boolean;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  const isCurrentPath = pathname === link.href;
  const variant = isCurrentPath ? 'default' : 'ghost';

  if (isCollapsed) {
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
            onClick={link.title === 'Đăng xuất' ? signOut : undefined}
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
      onClick={link.title === 'Đăng xuất' ? signOut : undefined}
    >
      <link.icon className='mr-2 h-4 w-4' />
      {link.title}
    </Link>
  );
}
