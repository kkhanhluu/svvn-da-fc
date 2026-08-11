import { Card } from './ui/card';

export interface DetailItem {
  label: string;
  value: string;
}

/** Label/value rows shared by the competition info tab and the match info card. */
export function DetailList({
  items,
  title,
}: {
  items: DetailItem[];
  title?: string;
}) {
  return (
    <Card className='overflow-hidden'>
      {title ? (
        <div className='border-b px-4 py-3 text-sm font-semibold sm:px-5 sm:py-3.5'>
          {title}
        </div>
      ) : null}
      {items.map((item) => (
        <div
          key={item.label}
          className='flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0 sm:px-5'
        >
          <span className='text-[13px] text-muted-foreground sm:text-sm'>
            {item.label}
          </span>
          <span className='text-right text-[13px] font-medium sm:text-sm'>
            {item.value}
          </span>
        </div>
      ))}
    </Card>
  );
}
