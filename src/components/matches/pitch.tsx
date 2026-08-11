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

function StatBadge({
  icon,
  count,
  className,
}: {
  icon: ReactNode;
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex h-4 items-center gap-0.5 rounded-full bg-background pl-0.5 pr-1 text-[10px] font-bold leading-none',
        className
      )}
    >
      {icon}
      {count}
    </span>
  );
}

function PlayerMarks({
  player,
  className,
  badgeClassName,
}: {
  player: LineupPlayer;
  className?: string;
  badgeClassName?: string;
}) {
  if (player.goals === 0 && player.assists === 0) {
    return null;
  }

  return (
    <div
      className={cn('absolute flex flex-col items-start gap-0.5', className)}
    >
      {player.goals > 0 ? (
        <StatBadge
          icon={<SoccerBall className='h-[11px] w-[11px]' />}
          count={player.goals}
          className={badgeClassName}
        />
      ) : null}
      {player.assists > 0 ? (
        <StatBadge
          icon={<MoveRight className='h-[11px] w-[11px]' />}
          count={player.assists}
          className={badgeClassName}
        />
      ) : null}
    </div>
  );
}

function Legend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-5 text-xs text-muted-foreground',
        className
      )}
    >
      <span className='flex items-center gap-1.5'>
        <SoccerBall className='h-3.5 w-3.5' /> Bàn thắng
      </span>
      <span className='flex items-center gap-1.5'>
        <MoveRight className='h-3.5 w-3.5' /> Kiến tạo
      </span>
    </div>
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
              'flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold',
              isHome
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background text-foreground'
            )}
          >
            {player.shirtNumber ?? '–'}
          </span>

          <PlayerMarks player={player} className='-top-1 left-[72%]' />
        </div>

        <span className='max-w-[92px] truncate rounded bg-background/95 px-1.5 py-px text-[11px] font-medium'>
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

/**
 * One team per card, rows flowing forwards-first down the page — a phone is
 * too narrow to place both sides on a single pitch and keep the names legible.
 */
function MobileSidePitch({
  side,
  isHome,
}: {
  side: SideLineup;
  isHome: boolean;
}) {
  const formation = getFormation(side.starters);
  // The pitch reads bottom-up on the desktop layout; here the attacking end is
  // at the top, so the goalkeeper row comes last.
  const rows = groupByPositionRow(side.starters)
    .filter((row) => row.length > 0)
    .reverse();

  return (
    <Card className='overflow-hidden'>
      <div className='flex items-center justify-between border-b px-4 py-3'>
        <span className='truncate text-sm font-semibold'>{side.teamName}</span>
        {formation ? (
          <span className='flex-none text-[13px] text-muted-foreground'>
            {formation}
          </span>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className='px-4 py-4 text-[13px] text-muted-foreground'>
          Chưa có đội hình cho đội này.
        </p>
      ) : (
        <>
          <div className='relative m-4 flex flex-col gap-6 rounded-[10px] border bg-muted/40 px-3 py-[18px]'>
            <div className='absolute inset-x-3 top-1/2 h-px bg-border' />
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className='relative flex justify-center gap-3.5'
              >
                {row.map((player) => (
                  <Link
                    key={player.key}
                    href={`/squad/${player.userId}`}
                    className='flex w-[78px] flex-col items-center gap-[5px]'
                  >
                    <div className='relative'>
                      <span
                        className={cn(
                          'flex h-[38px] w-[38px] items-center justify-center rounded-full text-[13px] font-semibold',
                          isHome
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-background text-foreground'
                        )}
                      >
                        {player.shirtNumber ?? '–'}
                      </span>
                      <PlayerMarks
                        player={player}
                        className='-top-1.5 -right-3'
                        badgeClassName='h-[17px] border shadow-sm'
                      />
                    </div>
                    <span className='w-full truncate text-center text-[11px] font-medium leading-[1.3]'>
                      {player.name.split(' ').slice(-1)}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <Legend className='px-4 pb-3.5' />
        </>
      )}

      {side.bench.length > 0 ? (
        <div className='border-t px-4 py-3 text-[13px] text-muted-foreground'>
          Dự bị: {side.bench.map((player) => player.name).join(', ')}
        </div>
      ) : null}
    </Card>
  );
}

export function Pitch({ sides }: { sides: SideLineup[] }) {
  const [homeSide, awaySide] = sides;

  return (
    <>
      <div className='flex flex-none flex-col gap-4 sm:hidden'>
        {sides.map((side, sideIndex) => (
          <MobileSidePitch
            key={side.teamId}
            side={side}
            isHome={sideIndex === 0}
          />
        ))}
      </div>

      <DesktopPitch homeSide={homeSide} awaySide={awaySide} sides={sides} />
    </>
  );
}

function DesktopPitch({
  homeSide,
  awaySide,
  sides,
}: {
  homeSide?: SideLineup;
  awaySide?: SideLineup;
  sides: SideLineup[];
}) {
  return (
    // flex-none keeps the fixed-height pitch from being squeezed when the page
    // container is a full-height flex column.
    <Card className='mx-auto hidden w-full max-w-4xl flex-none overflow-hidden sm:block'>
      {homeSide && awaySide ? (
        <div className='flex items-center justify-between gap-4 border-b px-4 py-3.5'>
          <SideCaption side={awaySide} isHome={false} />
          <SideCaption side={homeSide} isHome />
        </div>
      ) : null}

      <div className='bg-green-700/10 px-4 py-2 dark:bg-green-500/10'>
        <div className='relative h-[640px] overflow-hidden border border-white dark:border-white/15'>
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

      <Legend className='border-t px-4 py-3' />
    </Card>
  );
}
