'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getPositionLabel } from '../../helpers/getPositionLabel';
import { getFullName } from '../../helpers/playerName';
import { SquadPlayer } from '../../types';
import { PlayerAvatar } from '../player-avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const PAGE_SIZE = 15;

export function SquadTable({ players }: { players: SquadPlayer[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(players.length / PAGE_SIZE);

  const pagePlayers = useMemo(
    () => players.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [players, page]
  );

  if (players.length === 0) {
    return <p className='text-muted-foreground'>Chưa có cầu thủ nào.</p>;
  }

  return (
    <div className='w-full'>
      <Card className='overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-14'>Số</TableHead>
              <TableHead>Cầu thủ</TableHead>
              <TableHead className='w-28'>Vị trí</TableHead>
              <TableHead className='text-center w-16'>Trận</TableHead>
              <TableHead className='text-center w-16'>Bàn</TableHead>
              <TableHead className='text-right w-24'>Kiến tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagePlayers.map((player) => {
              const name = getFullName(player);

              return (
                <TableRow key={player.user_id}>
                  <TableCell className='font-semibold text-muted-foreground'>
                    {player.shirt_number ?? '–'}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/squad/${player.user_id}`}
                      className='flex items-center gap-3 hover:underline'
                    >
                      <PlayerAvatar
                        name={name}
                        avatarUrl={player.avatar_url}
                        className='flex-none'
                      />
                      <span className='font-medium'>{name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {getPositionLabel(player.player_position)}
                  </TableCell>
                  <TableCell className='text-center'>{player.apps}</TableCell>
                  <TableCell className='text-center font-semibold'>
                    {player.goals}
                  </TableCell>
                  <TableCell className='text-right'>
                    {player.assists}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
      {pageCount > 1 ? (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((current) => current + 1)}
            disabled={page >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
