import Link from 'next/link';
import { cn } from '../../lib/utils';

export interface TabLink {
  key: string;
  label: string;
  href: string;
}

/**
 * Segmented control built from links so the tabbed pages stay server rendered
 * and the selected tab survives a refresh or a shared URL.
 */
export function TabLinks({
  tabs,
  activeKey,
}: {
  tabs: TabLink[];
  activeKey: string;
}) {
  return (
    <div className='inline-flex h-9 items-center gap-1 rounded-lg bg-muted p-1'>
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={cn(
            'inline-flex h-7 items-center rounded-md px-3 text-sm font-medium transition-colors',
            tab.key === activeKey
              ? 'bg-background text-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
