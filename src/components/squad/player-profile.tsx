import Link from 'next/link';
import { cn } from '../../lib/utils';
import { PlayerCompetitionStat, UserProfile } from '../../types';
import { Card } from '../ui/card';
import { PlayerProfileHeader } from './player-profile-header';

export interface PlayerMatchRow {
  matchId: number;
  competitionId: number;
  date: string;
  fixture: string;
  score: string;
  outcome: 'win' | 'draw' | 'loss' | 'none';
  contribution: string;
}

const OUTCOME_CLASSES: Record<PlayerMatchRow['outcome'], string> = {
  win: 'text-green-600',
  draw: 'text-muted-foreground',
  loss: 'text-destructive',
  none: 'text-muted-foreground',
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className='px-4 py-3.5 sm:px-5 sm:py-4'>
      <p className='mb-1 text-xs text-muted-foreground sm:mb-1.5 sm:text-sm'>
        {label}
      </p>
      <p className='text-[22px] font-semibold tracking-tight sm:text-2xl'>
        {value}
      </p>
    </Card>
  );
}

export function PlayerProfile({
  player,
  isAdmin,
  canEditAvatar,
  apps,
  goals,
  assists,
  motmVotes,
  byCompetition,
  recentMatches,
}: {
  player: UserProfile;
  isAdmin: boolean;
  canEditAvatar: boolean;
  apps: number;
  goals: number;
  assists: number;
  motmVotes: number;
  byCompetition: PlayerCompetitionStat[];
  recentMatches: PlayerMatchRow[];
}) {
  return (
    <div className='space-y-6'>
      <PlayerProfileHeader
        player={player}
        isAdmin={isAdmin}
        canEditAvatar={canEditAvatar}
      />

      <div className='grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-5'>
        <StatCard label='Trận' value={apps} />
        <StatCard label='Bàn thắng' value={goals} />
        <StatCard label='Kiến tạo' value={assists} />
        <StatCard
          label='Bàn/trận'
          value={apps === 0 ? '0.00' : (goals / apps).toFixed(2)}
        />
        <StatCard label='Phiếu MOTM' value={motmVotes} />
      </div>

      <div className='grid items-start gap-4 lg:grid-cols-2'>
        <Card className='overflow-hidden'>
          <div className='border-b px-4 py-3 text-sm font-semibold sm:px-5 sm:py-3.5'>
            Theo giải đấu
          </div>
          {byCompetition.length === 0 ? (
            <p className='px-4 py-4 text-sm text-muted-foreground sm:px-5'>
              Chưa tham gia giải đấu nào.
            </p>
          ) : (
            byCompetition.map((competition) => (
              // Phone: the tally moves under the name rather than fighting it
              // for room on one line.
              <Link
                key={competition.competition_id}
                href={`/competitions/${competition.competition_id}`}
                className='block border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50 sm:flex sm:items-center sm:gap-4 sm:px-5'
              >
                <span className='block min-w-0 flex-1 truncate text-sm'>
                  {competition.competition_name}
                </span>
                <span className='mt-0.5 block whitespace-nowrap text-xs text-muted-foreground sm:mt-0 sm:text-sm'>
                  {competition.apps} trận · {competition.goals} bàn ·{' '}
                  {competition.assists} KT
                </span>
              </Link>
            ))
          )}
        </Card>

        <Card className='overflow-hidden'>
          <div className='border-b px-4 py-3 text-sm font-semibold sm:px-5 sm:py-3.5'>
            Các trận gần đây
          </div>
          {recentMatches.length === 0 ? (
            <p className='px-4 py-4 text-sm text-muted-foreground sm:px-5'>
              Chưa có trận đấu nào.
            </p>
          ) : (
            recentMatches.map((match) => (
              <Link
                key={match.matchId}
                href={`/competitions/${match.competitionId}/matches/${match.matchId}`}
                className='flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50 sm:px-5'
              >
                <span className='hidden w-[68px] flex-none text-sm text-muted-foreground sm:block'>
                  {match.date}
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-sm'>
                    {match.fixture}
                  </span>
                  <span className='block truncate text-xs text-muted-foreground sm:hidden'>
                    {match.date} · {match.contribution}
                  </span>
                </span>
                <span
                  className={cn(
                    'w-12 flex-none text-center text-sm font-semibold',
                    OUTCOME_CLASSES[match.outcome]
                  )}
                >
                  {match.score}
                </span>
                <span className='hidden w-24 flex-none text-right text-sm text-muted-foreground sm:block'>
                  {match.contribution}
                </span>
              </Link>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
