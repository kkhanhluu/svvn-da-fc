import { format } from 'date-fns';
import Link from 'next/link';
import { isPlayed } from '../../helpers/competition';
import { getTeamAbbr } from '../../helpers/playerName';
import { MatchWithTeams } from '../../types';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

const NO_ROUND = -1;

function groupByRound(matches: MatchWithTeams[]) {
  const rounds = new Map<number, MatchWithTeams[]>();

  matches.forEach((match) => {
    const round = match.round ?? NO_ROUND;
    rounds.set(round, [...(rounds.get(round) ?? []), match]);
  });

  return Array.from(rounds.entries()).sort(([a], [b]) => b - a);
}

function TeamRow({
  name,
  abbr,
  score,
  isWinner,
  isLoser,
}: {
  name: string;
  abbr: string | null;
  score: number | null;
  isWinner: boolean;
  isLoser: boolean;
}) {
  return (
    <div className='flex items-center gap-2.5'>
      <span className='flex h-[22px] w-[22px] flex-none items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground'>
        {getTeamAbbr(name, abbr)}
      </span>
      <span
        className={cn(
          'flex-1 text-sm truncate',
          isWinner && 'font-semibold text-green-600',
          isLoser && 'text-muted-foreground'
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          'w-7 text-right text-sm font-semibold',
          isWinner && 'text-green-600',
          isLoser && 'text-muted-foreground'
        )}
      >
        {score ?? '–'}
      </span>
    </div>
  );
}

export function MatchesTab({
  matches,
  competitionId,
}: {
  matches: MatchWithTeams[];
  competitionId: number;
}) {
  if (matches.length === 0) {
    return (
      <p className='text-muted-foreground'>Chưa có trận đấu nào được ghi.</p>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {groupByRound(matches).map(([round, roundMatches]) => (
        <Card key={round} className='overflow-hidden'>
          <div className='flex items-center justify-between border-b px-5 py-3.5'>
            <p className='text-sm font-semibold'>
              {round === NO_ROUND ? 'Trận đấu khác' : `Vòng ${round}`}
            </p>
            <p className='text-sm text-muted-foreground'>
              {roundMatches.length} trận
            </p>
          </div>
          {roundMatches.map((match) => {
            const played = isPlayed(match);
            const homeWon =
              played && (match.home_score ?? 0) > (match.away_score ?? 0);
            const awayWon =
              played && (match.away_score ?? 0) > (match.home_score ?? 0);

            return (
              <Link
                key={match.id}
                href={`/competitions/${competitionId}/matches/${match.id}`}
                className='flex items-center gap-5 border-b px-5 py-3.5 last:border-b-0 hover:bg-muted/50 transition-colors'
              >
                <div className='w-[92px] flex-none text-sm text-muted-foreground'>
                  <p>{format(new Date(match.match_date), 'dd/MM/yy')}</p>
                  <p className='font-semibold'>{played ? 'FT' : '—'}</p>
                </div>
                <div className='flex-1 min-w-0 flex flex-col gap-2'>
                  <TeamRow
                    name={match.home_team.name}
                    abbr={match.home_team.abbr}
                    score={match.home_score}
                    isWinner={homeWon}
                    isLoser={awayWon}
                  />
                  <TeamRow
                    name={match.away_team.name}
                    abbr={match.away_team.abbr}
                    score={match.away_score}
                    isWinner={awayWon}
                    isLoser={homeWon}
                  />
                </div>
              </Link>
            );
          })}
        </Card>
      ))}
    </div>
  );
}
