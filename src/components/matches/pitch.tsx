import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  getFormation,
  groupByPositionRow,
  LineupPlayer,
  SideLineup,
} from '../../helpers/buildLineups';
import { cn } from '../../lib/utils';
import { SoccerBall } from '../icons/soccer-ball';
import { Card } from '../ui/card';

// Vertical position of the goalkeeper/defender/midfielder/forward rows, in
// percent of the pitch height. The home side defends the bottom goal, so its
// rows run backwards and stop short of the touchline to leave room for names.
const HOME_ROW_Y = [92, 80, 68, 56];
const AWAY_ROW_Y = [5, 17.5, 30, 42];

function StatBadge({ icon, count }: { icon: ReactNode; count: number }) {
  return (
    <span className='flex h-4 items-center gap-0.5 rounded-full bg-background pl-0.5 pr-1 text-[10px] font-bold leading-none'>
      {icon}
      {count}
    </span>
  );
}

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
  return (
    <div
      className='absolute -translate-x-1/2 -translate-y-1/2'
      style={{ top: `${top}%`, left }}
    >
      <Link
        href={`/squad/${player.userId}`}
        className='flex flex-col items-center gap-1 transition-transform hover:scale-110'
      >
        <div className='relative'>
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold sm:h-11 sm:w-11 sm:text-[15px]',
              isHome
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground'
            )}
          >
            {player.shirtNumber ?? '–'}
          </span>

          {player.goals > 0 || player.assists > 0 ? (
            <div className='absolute -top-1 left-[72%] flex flex-col items-start gap-0.5'>
              {player.goals > 0 ? (
                <StatBadge
                  icon={<SoccerBall className='h-[11px] w-[11px]' />}
                  count={player.goals}
                />
              ) : null}
              {player.assists > 0 ? (
                <StatBadge
                  icon={<MoveRight className='h-[11px] w-[11px]' />}
                  count={player.assists}
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <span className='max-w-[72px] truncate rounded bg-background/95 px-1.5 py-px text-[10px] font-medium sm:max-w-[92px] sm:text-[11px]'>
          {player.name.split(' ').slice(-2).join(' ')}
        </span>
      </Link>
    </div>
  );
}

/** side.starters render at the bottom (home) or top (away) of the pitch. */
function SideCaption({ side, isHome }: { side: SideLineup; isHome: boolean }) {
  const dot = (
    <span
      className={cn(
        'h-3.5 w-3.5 flex-none rounded-full',
        isHome ? 'bg-primary' : 'border-[1.5px] border-muted-foreground/40'
      )}
    />
  );

  const formation = getFormation(side.starters);

  return (
    <span className='flex min-w-0 items-center gap-2 text-sm font-semibold'>
      {isHome ? null : dot}
      <span className='truncate'>{side.teamName}</span>
      {formation ? <span className='flex-none'>· {formation}</span> : null}
      {isHome ? dot : null}
    </span>
  );
}

export function Pitch({ sides }: { sides: SideLineup[] }) {
  const [homeSide, awaySide] = sides;

  return (
    <Card className='mx-auto w-full max-w-4xl overflow-hidden'>
      {homeSide && awaySide ? (
        <div className='flex items-center justify-between gap-4 border-b px-4 py-3.5'>
          <SideCaption side={awaySide} isHome={false} />
          <SideCaption side={homeSide} isHome />
        </div>
      ) : null}

      <div className='bg-green-700/10 px-4 py-2 dark:bg-green-500/10'>
        <div className='relative h-[560px] overflow-hidden border border-white sm:h-[640px] dark:border-white/15'>
          <div className='absolute left-0 right-0 top-1/2 border-t border-white dark:border-white/15' />
          <div className='absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white dark:border-white/15' />
          <div className='absolute left-1/2 top-0 h-[12%] w-[20%] -translate-x-1/2 border-x border-b border-white dark:border-white/15' />
          <div className='absolute bottom-0 left-1/2 h-[12%] w-[20%] -translate-x-1/2 border-x border-t border-white dark:border-white/15' />

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
      </div>

      <div className='flex items-center gap-5 border-t px-4 py-3 text-xs text-muted-foreground'>
        <span className='flex items-center gap-1.5'>
          <SoccerBall className='h-3.5 w-3.5' /> Bàn thắng
        </span>
        <span className='flex items-center gap-1.5'>
          <MoveRight className='h-3.5 w-3.5' /> Kiến tạo
        </span>
      </div>
    </Card>
  );
}
