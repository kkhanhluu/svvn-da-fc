'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    href?: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map((link, index) => (
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
  link: NavProps['links'][0];
  isCollapsed: boolean;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  const isCurrentPath = pathname.includes(link.href ?? 'impossible-route');
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
        buttonVariants({ variant, size: 'sm' }),
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
