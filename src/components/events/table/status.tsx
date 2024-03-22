import { Row } from '@tanstack/react-table';
import { EventWithTraining } from '../../../types';
import { Badge } from '../../ui/badge';
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
        <Badge className='text-white bg-green-600'>Đã đăng ký</Badge>
      </TableCell>
    );
  }
  return (
    <TableCell>
      <Badge variant='destructive'>Chưa đăng ký</Badge>
    </TableCell>
  );
}
