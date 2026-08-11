'use client';

import { MoveRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  getPositionGroup,
  getPositionLabel,
  POSITION_OPTIONS,
} from '../../helpers/getPositionLabel';
import { getFullName } from '../../helpers/playerName';
import { cn } from '../../lib/utils';
import { SquadPlayer } from '../../types';
import { SoccerBall } from '../icons/soccer-ball';
import { PlayerAvatar } from '../player-avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const PAGE_SIZE = 15;

const ALL_POSITIONS = 'all';

const POSITION_FILTERS = [
  { value: ALL_POSITIONS, label: 'Tất cả' },
  ...POSITION_OPTIONS,
];

/** Name, shirt number or position — whatever the reader has in mind. */
function matchesQuery(player: SquadPlayer, query: string): boolean {
  if (query === '') {
    return true;
  }

  return (
    getFullName(player).toLowerCase().includes(query) ||
    String(player.shirt_number ?? '') === query ||
    getPositionLabel(player.player_position).toLowerCase().includes(query)
  );
}

function matchesPosition(player: SquadPlayer, position: string): boolean {
  if (position === ALL_POSITIONS) {
    return true;
  }

  return (
    player.player_position != null &&
    player.player_position.trim() !== '' &&
    getPositionGroup(player.player_position) === position
  );
}

export function SquadTable({ players }: { players: SquadPlayer[] }) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<string>(ALL_POSITIONS);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return players.filter(
      (player) =>
        matchesQuery(player, normalizedQuery) &&
        matchesPosition(player, position)
    );
  }, [players, query, position]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  // Filtering can drop the list below the page being read; clamp instead of
  // resetting so narrowing a search doesn't jump back to the first page.
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));

  const pagePlayers = useMemo(
    () =>
      filtered.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE
      ),
    [filtered, currentPage]
  );

  if (players.length === 0) {
    return <p className='text-muted-foreground'>Chưa có cầu thủ nào.</p>;
  }

  return (
    <div className='w-full'>
      <div className='mb-4 space-y-3'>
        <div className='relative'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Tìm theo tên, số áo, vị trí…'
            className='h-11 pl-9'
          />
        </div>
        <div className='-mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden'>
          {POSITION_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type='button'
              onClick={() => setPosition(filter.value)}
              className={cn(
                'inline-flex h-8 flex-none items-center rounded-full border px-3 text-[13px] font-medium transition-colors',
                filter.value === position
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted/50'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className='py-5 text-center text-sm text-muted-foreground'>
          Không tìm thấy cầu thủ nào.
        </p>
      ) : (
        <>
          {/* Phone: one tappable row per player. The table needs more width
              than 390px gives, so it only appears from `sm` up. */}
          <Card className='overflow-hidden sm:hidden'>
            {pagePlayers.map((player) => {
              const name = getFullName(player);

              return (
                <Link
                  key={player.user_id}
                  href={`/squad/${player.user_id}`}
                  className='flex items-center gap-3 border-b px-4 py-3 last:border-b-0 transition-colors hover:bg-muted/50'
                >
                  <PlayerAvatar
                    name={name}
                    avatarUrl={player.avatar_url}
                    className='h-10 w-10 flex-none'
                    fallbackClassName='text-xs'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-[15px] font-medium'>{name}</p>
                    <p className='truncate text-xs text-muted-foreground'>
                      #{player.shirt_number ?? '–'} ·{' '}
                      {getPositionLabel(player.player_position)} ·{' '}
                      {player.apps} trận
                    </p>
                  </div>
                  <div className='flex flex-none items-center gap-3'>
                    <span className='flex items-center gap-1 text-[13px] font-semibold'>
                      <SoccerBall className='h-3.5 w-3.5 text-muted-foreground' />
                      {player.goals}
                    </span>
                    <span className='flex items-center gap-1 text-[13px] text-muted-foreground'>
                      <MoveRight className='h-3.5 w-3.5' />
                      {player.assists}
                    </span>
                  </div>
                </Link>
              );
            })}
          </Card>

          <Card className='hidden overflow-hidden sm:block'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-14'>Số</TableHead>
                  <TableHead>Cầu thủ</TableHead>
                  <TableHead className='w-28'>Vị trí</TableHead>
                  <TableHead className='w-16 text-center'>Trận</TableHead>
                  <TableHead className='w-16 text-center'>Bàn</TableHead>
                  <TableHead className='w-24 text-right'>Kiến tạo</TableHead>
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
                      <TableCell className='text-center'>
                        {player.apps}
                      </TableCell>
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
        </>
      )}

      {pageCount > 1 ? (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
