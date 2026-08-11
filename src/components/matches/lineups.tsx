import Link from 'next/link';
import {
  getFormation,
  LineupPlayer,
  SideLineup,
} from '../../helpers/buildLineups';
import { getShortPositionLabel } from '../../helpers/getPositionLabel';
import { cn } from '../../lib/utils';
import { PlayerAvatar } from '../player-avatar';
import { Card } from '../ui/card';
import { Pitch } from './pitch';

function formatMarks(player: LineupPlayer): string {
  const marks = [];
  if (player.goals > 0) {
    marks.push(`${player.goals} bàn`);
  }
  if (player.assists > 0) {
    marks.push(`${player.assists} KT`);
  }
  return marks.join(' ');
}

function PlayerRow({ player }: { player: LineupPlayer }) {
  const marks = formatMarks(player);

  return (
    <Link
      href={`/squad/${player.userId}`}
      className={cn(
        'flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0 sm:px-5',
        'transition-colors hover:bg-muted/50'
      )}
    >
      <span className='w-6 flex-none text-sm font-semibold text-muted-foreground'>
        {player.shirtNumber ?? '–'}
      </span>
      <PlayerAvatar
        name={player.name}
        avatarUrl={player.avatarUrl}
        className='h-7 w-7 flex-none'
        fallbackClassName='text-[10px]'
      />
      <span className='min-w-0 flex-1 truncate text-sm'>{player.name}</span>
      <span className='w-8 flex-none text-right text-xs text-muted-foreground sm:w-10 sm:text-left sm:text-sm'>
        {getShortPositionLabel(player.position)}
      </span>
      {marks ? (
        <span className='flex-none text-right text-xs text-muted-foreground sm:w-24 sm:text-sm'>
          {marks}
        </span>
      ) : (
        <span className='hidden w-24 flex-none sm:block' />
      )}
    </Link>
  );
}

function SideCard({ side }: { side: SideLineup }) {
  return (
    <Card className='overflow-hidden'>
      <div className='flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-3.5'>
        <p className='truncate text-sm font-semibold'>{side.teamName}</p>
        <p className='flex-none text-[13px] text-muted-foreground sm:text-sm'>
          {getFormation(side.starters)}
        </p>
      </div>
      {side.starters.map((player) => (
        <PlayerRow key={player.key} player={player} />
      ))}
      {side.bench.length > 0 ? (
        <div className='border-t px-4 py-3 text-[13px] text-muted-foreground sm:px-5 sm:text-sm'>
          Dự bị: {side.bench.map((player) => player.name).join(', ')}
        </div>
      ) : null}
    </Card>
  );
}

/** True once any starters have been recorded — otherwise there's nothing to switch views on. */
export function hasLineupPlayers(sides: SideLineup[]): boolean {
  return sides.some((side) => side.starters.length > 0);
}

export function Lineups({ sides, view }: { sides: SideLineup[]; view: string }) {
  if (!hasLineupPlayers(sides)) {
    return (
      <p className='text-muted-foreground'>
        Chưa có đội hình nào được ghi cho trận đấu này.
      </p>
    );
  }

  return view === 'list' ? (
    <div className='grid gap-4 lg:grid-cols-2 items-start'>
      {sides.map((side) => (
        <SideCard key={side.teamId} side={side} />
      ))}
    </div>
  ) : (
    <Pitch sides={sides} />
  );
}
