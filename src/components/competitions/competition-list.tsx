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
            <Card className='flex items-center gap-5 px-6 py-5 hover:bg-muted/50 transition-colors'>
              <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground'>
                {getTeamAbbr(competition.name)}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold truncate'>{competition.name}</p>
                <p className='text-sm text-muted-foreground truncate'>
                  {getCompetitionMeta(competition, teams.length)}
                </p>
              </div>
              <span className='text-sm text-muted-foreground whitespace-nowrap hidden sm:block'>
                {formatRecord(record)}
              </span>
              <Badge
                variant={
                  competition.status === 'finished' ? 'secondary' : 'default'
                }
              >
                {getCompetitionStatusLabel(competition.status)}
              </Badge>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
