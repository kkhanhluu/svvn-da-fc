import Link from 'next/link';
import {
  formatRecord,
  getCompetitionMeta,
  getCompetitionStatusLabel,
  getTeamRecord,
} from '../../helpers/competition';
import { getTeamAbbr } from '../../helpers/playerName';
import { Competition, CompetitionTeam, Match } from '../../types';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export type CompetitionWithTeams = Competition & {
  competition_teams: Pick<CompetitionTeam, 'id' | 'name' | 'is_own_team'>[];
};

type MatchSummary = Pick<
  Match,
  | 'competition_id'
  | 'home_team_id'
  | 'away_team_id'
  | 'home_score'
  | 'away_score'
  | 'status'
>;

export function CompetitionList({
  competitions,
  matches,
}: {
  competitions: CompetitionWithTeams[];
  matches: MatchSummary[];
}) {
  if (competitions.length === 0) {
    return (
      <p className='text-muted-foreground'>
        Chưa có giải đấu nào được tạo.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      {competitions.map((competition) => {
        const teams = competition.competition_teams ?? [];
        const ownTeam = teams.find((team) => team.is_own_team);
        const record = getTeamRecord(
          matches.filter((match) => match.competition_id === competition.id),
          ownTeam?.id
        );

        return (
          <Link key={competition.id} href={`/competitions/${competition.id}`}>
            {/* Phone: name row on top, status and record below. `sm:contents`
                flattens both wrappers so the card is a single row on desktop. */}
            <Card className='p-4 transition-colors hover:bg-muted/50 sm:flex sm:items-center sm:gap-5 sm:px-6 sm:py-5'>
              <div className='flex items-center gap-3 sm:contents'>
                <div className='flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-muted text-[13px] font-semibold text-muted-foreground sm:h-11 sm:w-11 sm:text-sm'>
                  {getTeamAbbr(competition.name)}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate font-semibold'>{competition.name}</p>
                  <p className='truncate text-[13px] text-muted-foreground sm:text-sm'>
                    {getCompetitionMeta(competition, teams.length)}
                  </p>
                </div>
              </div>
              <div className='mt-3 flex flex-row-reverse items-center justify-between gap-2 sm:mt-0 sm:contents'>
                <span className='whitespace-nowrap text-[13px] text-muted-foreground sm:text-sm'>
                  {formatRecord(record)}
                </span>
                <Badge
                  variant={
                    competition.status === 'finished' ? 'secondary' : 'default'
                  }
                >
                  {getCompetitionStatusLabel(competition.status)}
                </Badge>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
