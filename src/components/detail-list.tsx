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
        <div className='border-b px-5 py-3.5 text-sm font-semibold'>
          {title}
        </div>
      ) : null}
      {items.map((item) => (
        <div
          key={item.label}
          className='flex items-center justify-between gap-4 border-b px-5 py-3 last:border-b-0'
        >
          <span className='text-sm text-muted-foreground'>{item.label}</span>
          <span className='text-sm font-medium text-right'>{item.value}</span>
        </div>
      ))}
    </Card>
  );
}
