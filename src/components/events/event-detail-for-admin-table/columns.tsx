import { ColumnDef } from '@tanstack/react-table';
import { Actions } from './actions';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'last_name',
    header: 'Họ',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.users.last_name}</div>;
    },
    size: 10,
  },
  {
    accessorKey: 'first_name',
    header: 'Tên',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.users.first_name}</div>;
    },
    size: 10,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div>{row.original.users.email}</div>;
    },
    size: 10,
  },
  {
    id: 'actions',
    cell: ({ row }) => <Actions row={row} />,
    size: 10,
  },
];
