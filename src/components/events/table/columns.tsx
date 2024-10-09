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
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.description}</div>;
    },
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
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
              className='md:w-[80%]'
              indicatorColor='bg-green-600'
              value={(currentNumber / maxNumber) * 100}
            />
          ) : null}
        </div>
      );
    },
    meta: {
      headerClassName: 'min-w-[100px] md:min-w-[150px]',
      cellClassName: 'min-w-[100px] md:min-w-[150px]',
    },
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
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
  },
  {
    accessorKey: 'location',
    header: 'Địa chỉ',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.location}</div>
    ),
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
  },
  {
    header: 'Đăng ký / Hủy đăng ký',
    id: 'actions',
    enableHiding: false,
    meta: {
      headerClassName: 'min-w-[100px]',
      cellClassName: 'min-w-[100px]',
    },
  },
];
