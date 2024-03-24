import { ColumnDef } from '@tanstack/react-table';
import { UserProfile } from '../../../types';

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: 'first_name',
    header: 'Tên',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.first_name}</div>;
    },
  },
  {
    accessorKey: 'last_name',
    header: 'Họ',
    cell: ({ row }) => {
      return <div className='capitalize'>{row.original.last_name}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <div>{row.original.email}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      return <div>{row.original.role}</div>;
    },
  },
  {
    accessorKey: 'temp_password',
    header: 'Mật khẩu tạm thời',
    cell: ({ row }) => {
      return <div>{row.original.temp_password}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
  },
];
