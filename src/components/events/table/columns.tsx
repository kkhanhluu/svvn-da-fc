import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { EventWithTraining } from '../../../types';
import { Progress } from '../../ui/progress';

export const columns: ColumnDef<EventWithTraining>[] = [
  {
    accessorKey: 'date',
    header: 'Ngày',
    cell: ({ row }) => (
      <div className=''>
        {format(new Date(row.getValue('date')), 'dd-MM-yyyy')}
      </div>
    ),
    size: 10,
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.description}</div>;
    },
    size: 10,
  },
  {
    accessorKey: 'numbers',
    header: 'Số lượng',
    cell: ({ row }) => {
      const currentNumber = (row.original.attendees as []).length;
      const maxNumber = row.original.max_attendees;
      const shouldShowProgress = maxNumber != null;
      return (
        <div className='flex flex-col gap-2'>
          <div className='capitalize font-semibold'>
            {currentNumber} {!shouldShowProgress ? '' : ` / ${maxNumber}`}
          </div>
          {shouldShowProgress ? (
            <Progress
              indicatorColor='bg-green-600'
              value={(currentNumber / maxNumber) * 100}
            />
          ) : null}
        </div>
      );
    },
    size: 40,
  },
  {
    accessorKey: 'time',
    header: 'Thời gian',
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.original.event_start_time.substring(0, 5)} -{' '}
        {row.original.event_end_time.substring(0, 5)}
      </div>
    ),
    size: 10,
  },
  {
    accessorKey: 'location',
    header: 'Địa chỉ',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.location}</div>
    ),
    size: 10,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    size: 10,
  },
  {
    header: 'Đăng ký / Hủy đăng ký',
    id: 'actions',
    enableHiding: false,
    size: 10,
  },
];
