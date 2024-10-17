import { Row } from '@tanstack/react-table';
import { EventWithTraining } from '../../../types';
import { Button } from '../../ui/button';
import { TableCell } from '../../ui/table';

export function Status({
  row,
  userId,
}: {
  row: Row<EventWithTraining>;
  userId: string;
}) {
  const attendees = row.original.attendees as any;
  if (attendees.indexOf(userId) >= 0) {
    return (
      <TableCell>
        <Button
          size='sm'
          onClick={undefined}
          className='text-xs text-white bg-green-600'
        >
          Đã đăng ký
        </Button>
      </TableCell>
    );
  }
  return (
    <TableCell>
      <Button
        size='sm'
        onClick={undefined}
        className='text-xs'
        variant='destructive'
      >
        Chưa đăng ký
      </Button>
    </TableCell>
  );
}
