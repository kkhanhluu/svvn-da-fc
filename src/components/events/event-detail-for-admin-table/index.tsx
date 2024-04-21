'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import html2canvas from 'html2canvas';
import { splitPlayersIntoTeams } from '../../../helpers/splitTeam';
import { Button } from '../../ui/button';
import { columns } from './columns';

export function EventDetailTableForAdmin({ data }: { data: any[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className='w-full'>
      <div className='rounded-md border'>
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
                <TableRow key={row.id}>
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
      <div className='flex justify-between space-x-2 py-8'>
        <Button
          onClick={() => {
            const teams = splitPlayersIntoTeams(
              data.map((item) => item.users)
            ).map((team) =>
              team.defenders.concat(team.midfielders).concat(team.forwards)
            );
            console.log(teams);
            // Create the table HTML
            const tableContainer = document.createElement('div');
            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            const tbody = document.createElement('tbody');
            teams.forEach((team, index) => {
              const teamRow = tbody.insertRow();
              const teamTitleCell = teamRow.insertCell();
              teamTitleCell.colSpan = 2;
              teamTitleCell.style.backgroundColor =
                index === 0 ? 'green' : index === 1 ? 'red' : 'blue';
              teamTitleCell.style.color = 'white'; // Make text white for better contrast
              teamTitleCell.appendChild(
                document.createTextNode(`Team ${index + 1}`)
              );

              team.forEach((player: any) => {
                const playerRow = tbody.insertRow();
                const playerNameCell = playerRow.insertCell();
                playerNameCell.style.border = '1px solid black'; // Apply cell style
                playerNameCell.style.color = 'white';
                playerNameCell.style.padding = '8px'; // Apply cell style
                playerNameCell.style.backgroundColor =
                  index === 0 ? 'green' : index === 1 ? 'red' : 'blue';
                playerNameCell.appendChild(
                  document.createTextNode(
                    `${player.last_name} ${player.first_name}`
                  )
                );
              });
            });

            table.appendChild(tbody);
            tableContainer.appendChild(table);
            document.body.appendChild(tableContainer);

            // Convert table to image and enable automatic download
            html2canvas(tableContainer).then((canvas) => {
              const image = canvas.toDataURL('image/png');

              // Create a download link
              const downloadLink = document.createElement('a');
              downloadLink.href = image;
              downloadLink.download = 'teams_table.png';
              downloadLink.style.display = 'none'; // Hide the link
              document.body.appendChild(downloadLink);

              // Trigger automatic download
              downloadLink.click();

              // Clean up: remove the temporary elements
              document.body.removeChild(downloadLink);
              document.body.removeChild(tableContainer);
            });
          }}
        >
          Chia đội ngẫu nhiên
        </Button>
        <div className='flex items-center justify-end space-x-2'>
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
    </div>
  );
}
