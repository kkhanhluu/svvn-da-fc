'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../../../types';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { columns } from './columns';

export function UserTable({
  users,
  training_id,
}: {
  users: UserProfile[];
  training_id?: string;
}) {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const router = useRouter();

  let label = 'Chọn buổi đá bóng';
  if (training_id === '6') {
    label = 'Bóng đá thứ 6';
  } else if (training_id === '7') {
    label = 'Bóng đá Chủ nhật';
  }

  return (
    <div className='w-full'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>{label}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href='/accounts?training_id=6'>Bóng đá thứ 6</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/accounts?training_id=7'>Bóng đá Chủ nhật</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='rounded-md border mt-8'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='cursor-pointer'
                  onClick={() => router.push(`/accounts/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
