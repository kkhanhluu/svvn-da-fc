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
    <Card className='px-5 py-4'>
      <p className='text-sm text-muted-foreground mb-1.5'>{label}</p>
      <p className='text-2xl font-semibold tracking-tight'>{value}</p>
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

      <div className='grid gap-3 grid-cols-2 lg:grid-cols-5'>
        <StatCard label='Trận' value={apps} />
        <StatCard label='Bàn thắng' value={goals} />
        <StatCard label='Kiến tạo' value={assists} />
        <StatCard
          label='Bàn/trận'
          value={apps === 0 ? '0.00' : (goals / apps).toFixed(2)}
        />
        <StatCard label='Phiếu MOTM' value={motmVotes} />
      </div>

      <div className='grid gap-4 lg:grid-cols-2 items-start'>
        <Card className='overflow-hidden'>
          <div className='border-b px-5 py-3.5 text-sm font-semibold'>
            Theo giải đấu
          </div>
          {byCompetition.length === 0 ? (
            <p className='px-5 py-4 text-sm text-muted-foreground'>
              Chưa tham gia giải đấu nào.
            </p>
          ) : (
            byCompetition.map((competition) => (
              <Link
                key={competition.competition_id}
                href={`/competitions/${competition.competition_id}`}
                className='flex items-center gap-4 border-b px-5 py-3 last:border-b-0 hover:bg-muted/50 transition-colors'
              >
                <span className='flex-1 min-w-0 truncate text-sm'>
                  {competition.competition_name}
                </span>
                <span className='text-sm text-muted-foreground whitespace-nowrap'>
                  {competition.apps} trận · {competition.goals} bàn ·{' '}
                  {competition.assists} KT
                </span>
              </Link>
            ))
          )}
        </Card>

        <Card className='overflow-hidden'>
          <div className='border-b px-5 py-3.5 text-sm font-semibold'>
            Các trận gần đây
          </div>
          {recentMatches.length === 0 ? (
            <p className='px-5 py-4 text-sm text-muted-foreground'>
              Chưa có trận đấu nào.
            </p>
          ) : (
            recentMatches.map((match) => (
              <Link
                key={match.matchId}
                href={`/competitions/${match.competitionId}/matches/${match.matchId}`}
                className='flex items-center gap-3 border-b px-5 py-3 last:border-b-0 hover:bg-muted/50 transition-colors'
              >
                <span className='w-[68px] flex-none text-sm text-muted-foreground'>
                  {match.date}
                </span>
                <span className='flex-1 min-w-0 truncate text-sm'>
                  {match.fixture}
                </span>
                <span
                  className={cn(
                    'w-12 flex-none text-center text-sm font-semibold',
                    OUTCOME_CLASSES[match.outcome]
                  )}
                >
                  {match.score}
                </span>
                <span className='w-24 flex-none text-right text-sm text-muted-foreground'>
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
