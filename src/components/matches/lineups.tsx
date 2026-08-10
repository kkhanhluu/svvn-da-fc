import Link from 'next/link';
import {
  getFormation,
  LineupPlayer,
  SideLineup,
} from '../../helpers/buildLineups';
import { getShortPositionLabel } from '../../helpers/getPositionLabel';
import { cn } from '../../lib/utils';
import { PlayerAvatar } from '../player-avatar';
import { TabLinks } from '../competitions/tab-links';
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
  const content = (
    <>
      <span className='w-6 flex-none text-sm font-semibold text-muted-foreground'>
        {player.shirtNumber ?? '–'}
      </span>
      <PlayerAvatar
        name={player.name}
        avatarUrl={player.avatarUrl}
        className='h-7 w-7 flex-none'
        fallbackClassName='text-[10px]'
      />
      <span className='flex-1 min-w-0 truncate text-sm'>{player.name}</span>
      <span className='w-10 flex-none text-sm text-muted-foreground'>
        {getShortPositionLabel(player.position)}
      </span>
      <span className='w-24 flex-none text-right text-sm text-muted-foreground'>
        {formatMarks(player)}
      </span>
    </>
  );

  return (
    <Link
      href={`/squad/${player.userId}`}
      className={cn(
        'flex items-center gap-3 border-b px-5 py-2.5 last:border-b-0',
        'hover:bg-muted/50 transition-colors'
      )}
    >
      {content}
    </Link>
  );
}

function SideCard({ side }: { side: SideLineup }) {
  return (
    <Card className='overflow-hidden'>
      <div className='flex items-center justify-between border-b px-5 py-3.5'>
        <p className='text-sm font-semibold'>{side.teamName}</p>
        <p className='text-sm text-muted-foreground'>
          {getFormation(side.starters)}
        </p>
      </div>
      {side.starters.map((player) => (
        <PlayerRow key={player.key} player={player} />
      ))}
      {side.bench.length > 0 ? (
        <div className='border-t px-5 py-3 text-sm text-muted-foreground'>
          Dự bị: {side.bench.map((player) => player.name).join(', ')}
        </div>
      ) : null}
    </Card>
  );
}

export function Lineups({
  sides,
  view,
  basePath,
}: {
  sides: SideLineup[];
  view: string;
  basePath: string;
}) {
  const hasPlayers = sides.some((side) => side.starters.length > 0);

  if (!hasPlayers) {
    return (
      <p className='text-muted-foreground'>
        Chưa có đội hình nào được ghi cho trận đấu này.
      </p>
    );
  }

  const tabs = [
    { key: 'pitch', label: 'Sơ đồ' },
    { key: 'list', label: 'Danh sách' },
  ].map((tab) => ({
    ...tab,
    href: `${basePath}?tab=lineups&view=${tab.key}`,
  }));

  return (
    <div className='space-y-4'>
      <TabLinks tabs={tabs} activeKey={view} />
      {view === 'list' ? (
        <div className='grid gap-4 lg:grid-cols-2 items-start'>
          {sides.map((side) => (
            <SideCard key={side.teamId} side={side} />
          ))}
        </div>
      ) : (
        <Pitch sides={sides} />
      )}
    </div>
  );
}
