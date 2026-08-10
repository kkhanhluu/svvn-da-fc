import Link from 'next/link';
import { Scorer } from '../../types';
import { PlayerAvatar } from '../player-avatar';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function ScorersTable({ scorers }: { scorers: Scorer[] }) {
  if (scorers.length === 0) {
    return (
      <p className='text-muted-foreground'>Chưa có bàn thắng nào được ghi.</p>
    );
  }

  return (
    <Card className='overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>#</TableHead>
            <TableHead>Cầu thủ</TableHead>
            <TableHead>Đội</TableHead>
            <TableHead className='text-center w-20'>Bàn</TableHead>
            <TableHead className='text-right w-24'>Kiến tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scorers.map((scorer, index) => (
            <TableRow key={scorer.player_key}>
              <TableCell className='text-muted-foreground'>
                {index + 1}
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <PlayerAvatar
                    name={scorer.player_name}
                    avatarUrl={scorer.avatar_url}
                    className='flex-none'
                  />
                  {scorer.user_id ? (
                    <Link
                      href={`/squad/${scorer.user_id}`}
                      className='font-medium hover:underline'
                    >
                      {scorer.player_name}
                    </Link>
                  ) : (
                    <span className='font-medium'>{scorer.player_name}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {scorer.team_name}
              </TableCell>
              <TableCell className='text-center font-semibold'>
                {scorer.goals}
              </TableCell>
              <TableCell className='text-right'>{scorer.assists}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
