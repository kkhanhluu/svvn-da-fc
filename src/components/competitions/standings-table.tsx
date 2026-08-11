import { Standing } from '../../types';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { cn } from '../../lib/utils';

function formatGoalDiff(goalDiff: number): string {
  return goalDiff > 0 ? `+${goalDiff}` : String(goalDiff);
}

export function StandingsTable({ standings }: { standings: Standing[] }) {
  if (standings.length === 0) {
    return <p className='text-muted-foreground'>Chưa có đội nào tham gia.</p>;
  }

  return (
    <div>
      <Card className='overflow-hidden'>
        <Table>
          <TableHeader>
            {/* Trận and Bàn drop out on a phone — the remaining columns are the
              ones the table is read for, and they fit 390px without scrolling. */}
            <TableRow>
              <TableHead className='w-8 pl-4 sm:w-12 sm:pl-2'>#</TableHead>
              <TableHead>Đội</TableHead>
              <TableHead className='hidden w-12 text-center sm:table-cell'>
                Trận
              </TableHead>
              <TableHead className='w-8 text-center sm:w-12'>T</TableHead>
              <TableHead className='w-8 text-center sm:w-12'>H</TableHead>
              <TableHead className='w-8 text-center sm:w-12'>B</TableHead>
              <TableHead className='hidden w-20 text-center sm:table-cell'>
                Bàn
              </TableHead>
              <TableHead className='w-10 text-center sm:w-16'>HS</TableHead>
              <TableHead className='w-10 pr-4 text-right sm:w-16 sm:pr-2'>
                <span className='sm:hidden'>Đ</span>
                <span className='hidden sm:inline'>Điểm</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((standing, index) => (
              <TableRow
                key={standing.team_id}
                className={cn(standing.is_own_team && 'bg-muted/50')}
              >
                <TableCell className='py-3.5 pl-4 text-muted-foreground sm:pl-2'>
                  {index + 1}
                </TableCell>
                <TableCell
                  className={cn(
                    'py-3.5 truncate',
                    standing.is_own_team && 'font-semibold'
                  )}
                >
                  {standing.team_name}
                </TableCell>
                <TableCell className='hidden py-3.5 text-center sm:table-cell'>
                  {standing.played}
                </TableCell>
                <TableCell className='py-3.5 text-center'>
                  {standing.won}
                </TableCell>
                <TableCell className='py-3.5 text-center'>
                  {standing.drawn}
                </TableCell>
                <TableCell className='py-3.5 text-center'>
                  {standing.lost}
                </TableCell>
                <TableCell className='hidden py-3.5 text-center sm:table-cell'>
                  {standing.goals_for}:{standing.goals_against}
                </TableCell>
                <TableCell className='py-3.5 text-center text-muted-foreground sm:text-foreground'>
                  {formatGoalDiff(standing.goal_diff)}
                </TableCell>
                <TableCell className='py-3.5 pr-4 text-right font-semibold sm:pr-2'>
                  {standing.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <p className='mt-3 text-xs text-muted-foreground'>
        Thắng 3 điểm · Hòa 1 điểm.
      </p>
    </div>
  );
}
