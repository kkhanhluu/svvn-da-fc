import { Goal, MoveRight } from 'lucide-react';
import Link from 'next/link';
import {
  groupByPositionRow,
  LineupPlayer,
  SideLineup,
} from '../../helpers/buildLineups';
import { cn } from '../../lib/utils';
import { PlayerAvatar } from '../player-avatar';

// Vertical position of the goalkeeper/defender/midfielder/forward rows, in
// percent of the pitch height. The home side defends the bottom goal.
const HOME_ROW_Y = [93, 81, 69, 57];
const AWAY_ROW_Y = [7, 19, 31, 43];

function PlayerChip({
  player,
  isHome,
  top,
  left,
}: {
  player: LineupPlayer;
  isHome: boolean;
  top: number;
  left: string;
}) {
  const content = (
    <>
      <div className='relative'>
        {player.avatarUrl ? (
          <>
            <PlayerAvatar
              name={player.name}
              avatarUrl={player.avatarUrl}
              className={cn(
                'h-8 w-8 border-2',
                isHome ? 'border-primary' : 'border-border'
              )}
              fallbackClassName='text-[10px]'
            />
            {player.shirtNumber != null ? (
              <span
                className={cn(
                  'absolute -bottom-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold',
                  isHome
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-foreground border'
                )}
              >
                {player.shirtNumber}
              </span>
            ) : null}
          </>
        ) : (
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold',
              isHome
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border'
            )}
          >
            {player.shirtNumber ?? ''}
          </span>
        )}
        {player.goals > 0 ? (
          <span className='absolute -right-1.5 -top-1.5 flex h-4 items-center gap-0.5 rounded-full bg-green-600 px-1 text-[9px] font-bold text-white'>
            <Goal className='h-2.5 w-2.5' />
            {player.goals}
          </span>
        ) : null}
        {player.assists > 0 ? (
          <span className='absolute -bottom-1.5 -right-1.5 flex h-4 items-center gap-0.5 rounded-full bg-sky-600 px-1 text-[9px] font-bold text-white'>
            <MoveRight className='h-2.5 w-2.5' />
            {player.assists}
          </span>
        ) : null}
      </div>
      <span className='max-w-[72px] truncate rounded bg-background/90 px-1 text-[10px] font-medium'>
        {player.name.split(' ').slice(-2).join(' ')}
      </span>
    </>
  );

  return (
    <div
      className='absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1'
      style={{ top: `${top}%`, left }}
    >
      <Link
        href={`/squad/${player.userId}`}
        className='flex flex-col items-center gap-1 transition-transform hover:scale-110'
      >
        {content}
      </Link>
    </div>
  );
}

export function Pitch({ sides }: { sides: SideLineup[] }) {
  return (
    <div className='relative w-full max-w-md mx-auto aspect-[2/3] rounded-xl border bg-green-600/10 dark:bg-green-500/10 overflow-hidden'>
      <div className='absolute left-0 right-0 top-1/2 border-t border-green-700/25' />
      <div className='absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-700/25' />
      <div className='absolute left-1/2 top-0 h-[12%] w-[45%] -translate-x-1/2 border-x border-b border-green-700/25' />
      <div className='absolute bottom-0 left-1/2 h-[12%] w-[45%] -translate-x-1/2 border-x border-t border-green-700/25' />

      {sides.map((side, sideIndex) => {
        const isHome = sideIndex === 0;
        const rowPositions = isHome ? HOME_ROW_Y : AWAY_ROW_Y;

        return groupByPositionRow(side.starters).map((row, rowIndex) =>
          row.map((player, playerIndex) => (
            <PlayerChip
              key={`${side.teamId}-${player.key}`}
              player={player}
              isHome={isHome}
              top={rowPositions[rowIndex]}
              left={`${((playerIndex + 1) / (row.length + 1)) * 100}%`}
            />
          ))
        );
      })}
    </div>
  );
}
