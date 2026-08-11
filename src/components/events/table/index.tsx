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
import { EventWithTraining } from '../../../types';
import { Card } from '../../ui/card';
import { Actions } from './actions';
import { columns } from './columns';
import { Status } from './status';

export function EventTable({
  events,
  userId,
}: {
  events: EventWithTraining[];
  userId: string;
}) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // An empty table would still be 700px wide, so the message would sit
  // off-screen on a phone — say it in the card instead.
  if (table.getRowModel().rows.length === 0) {
    return (
      <Card className='p-6 text-center text-sm text-muted-foreground'>
        Chưa có buổi đá bóng nào trong tuần này.
      </Card>
    );
  }

  return (
    // Seven columns never fit a phone; the card keeps the page gutters intact
    // and lets the table itself scroll sideways.
    <Card className='overflow-hidden'>
      <div className='w-full overflow-x-auto'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.headerClassName}
                    >
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  if (cell.id.indexOf('status') >= 0) {
                    return <Status key={cell.id} row={row} userId={userId} />;
                  } else if (cell.id.indexOf('actions') >= 0) {
                    return <Actions key={cell.id} row={row} userId={userId} />;
                  }
                  return (
                    <TableCell
                      className={cell.column.columnDef.meta?.cellClassName}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
