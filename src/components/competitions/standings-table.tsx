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
    <Card className='overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>#</TableHead>
            <TableHead>Đội</TableHead>
            <TableHead className='text-center w-12'>Trận</TableHead>
            <TableHead className='text-center w-12'>T</TableHead>
            <TableHead className='text-center w-12'>H</TableHead>
            <TableHead className='text-center w-12'>B</TableHead>
            <TableHead className='text-center w-20'>Bàn</TableHead>
            <TableHead className='text-center w-16'>HS</TableHead>
            <TableHead className='text-right w-16'>Điểm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow
              key={standing.team_id}
              className={cn(standing.is_own_team && 'bg-muted/50')}
            >
              <TableCell className='text-muted-foreground'>
                {index + 1}
              </TableCell>
              <TableCell
                className={cn(standing.is_own_team && 'font-semibold')}
              >
                {standing.team_name}
              </TableCell>
              <TableCell className='text-center'>{standing.played}</TableCell>
              <TableCell className='text-center'>{standing.won}</TableCell>
              <TableCell className='text-center'>{standing.drawn}</TableCell>
              <TableCell className='text-center'>{standing.lost}</TableCell>
              <TableCell className='text-center'>
                {standing.goals_for}:{standing.goals_against}
              </TableCell>
              <TableCell className='text-center'>
                {formatGoalDiff(standing.goal_diff)}
              </TableCell>
              <TableCell className='text-right font-semibold'>
                {standing.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
