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
 *
 * On a phone the strip fills the width: `fill` splits it into equal segments,
 * otherwise it scrolls sideways once the labels stop fitting.
 */
export function TabLinks({
  tabs,
  activeKey,
  fill = false,
}: {
  tabs: TabLink[];
  activeKey: string;
  fill?: boolean;
}) {
  return (
    <div
      className={cn(
        // flex-none: the horizontal scroll below zeroes this box's automatic
        // minimum height, so a flex-column page would otherwise squash the
        // strip flat once its content outgrows the viewport.
        // self-start keeps the track hugging its tabs instead of being
        // stretched across the whole content column.
        'flex w-full flex-none items-center gap-0.5 rounded-lg bg-muted p-1 sm:inline-flex sm:h-11 sm:w-auto sm:gap-1 sm:self-start sm:p-1.5',
        // Four Vietnamese labels fit a 390px screen at this size; the scroll
        // is a fallback for narrower phones, not the normal state.
        !fill && 'overflow-x-auto [&::-webkit-scrollbar]:hidden'
      )}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={cn(
            'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-2 text-xs font-medium leading-none transition-colors sm:h-8 sm:px-4 sm:text-sm',
            fill ? 'flex-1 sm:flex-none' : 'flex-none',
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
