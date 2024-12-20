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
  LockKeyhole,
  LogOut,
  LucideIcon,
  Mail,
  MoonIcon,
  Settings,
  SunIcon,
  User,
  UserPlus,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { Button, buttonVariants } from './ui/button';
import { Separator } from './ui/separator';

interface NavProps {
  isAdmin: boolean;
}

const USER_LINKS = [
  {
    title: 'Thông báo',
    icon: Mail,
    href: '/notification',
  },
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
  {
    title: 'Buổi đá bóng',
    label: '',
    icon: CalendarPlus,
    href: '/events/admin',
  },
];

export function Nav({ isAdmin }: NavProps) {
  const { setTheme, theme } = useTheme();

  return (
    <div className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'>
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
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
        <Button
          variant='ghost'
          size='icon'
          className='w-[36px] md:w-full md:px-8 md:justify-start'
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
          <span className='hidden md:block md:ml-[4px]'>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </Button>
      </nav>
    </div>
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
  };
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  const isCurrentPath = pathname === link.href;
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
