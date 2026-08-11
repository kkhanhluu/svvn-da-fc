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
      <span className='flex h-6 w-6 flex-none items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground sm:h-[22px] sm:w-[22px]'>
        {getTeamAbbr(name, abbr)}
      </span>
      <span
        className={cn(
          'flex-1 truncate text-[15px] sm:text-sm',
          isWinner && 'font-semibold text-green-600',
          isLoser && 'text-muted-foreground'
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          'w-7 text-right text-[15px] font-semibold sm:text-sm',
          isWinner && 'text-green-600',
          isLoser && 'text-muted-foreground'
        )}
      >
        {score ?? '–'}
      </span>
    </div>
  );
}

/** Phone summary of a played match: "Svvnda thắng", "Hòa", or "Chưa đá". */
function getResultLabel(match: MatchWithTeams): string {
  if (!isPlayed(match)) {
    return 'Chưa đá';
  }

  const homeScore = match.home_score ?? 0;
  const awayScore = match.away_score ?? 0;

  if (homeScore === awayScore) {
    return 'Hòa';
  }
  return `${
    homeScore > awayScore ? match.home_team.name : match.away_team.name
  } thắng`;
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
          <div className='flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-3.5'>
            <p className='text-sm font-semibold'>
              {round === NO_ROUND ? 'Trận đấu khác' : `Vòng ${round}`}
            </p>
            <p className='text-xs text-muted-foreground sm:text-sm'>
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
                className='block border-b px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/50 sm:flex sm:items-center sm:gap-5 sm:px-5'
              >
                {/* Phone: date and outcome share one line above the teams.
                    Desktop keeps them in a fixed column to the left. */}
                <div className='mb-2.5 flex items-center justify-between gap-3 text-xs text-muted-foreground sm:mb-0 sm:block sm:w-[92px] sm:flex-none sm:text-sm'>
                  <p>{format(new Date(match.match_date), 'dd/MM/yy')}</p>
                  <p
                    className={cn(
                      'truncate font-semibold sm:hidden',
                      played && !homeWon && !awayWon && 'text-muted-foreground',
                      (homeWon || awayWon) && 'text-green-600'
                    )}
                  >
                    {getResultLabel(match)}
                  </p>
                  <p className='hidden font-semibold sm:block'>
                    {played ? 'FT' : '—'}
                  </p>
                </div>
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
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
