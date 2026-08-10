import { Competition } from '../types';

export interface TeamRecord {
  won: number;
  drawn: number;
  lost: number;
}

interface MatchResult {
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  status: string;
}

export function isPlayed(match: MatchResult): boolean {
  return (
    match.status === 'finished' &&
    match.home_score != null &&
    match.away_score != null
  );
}

export function getTeamRecord(
  matches: MatchResult[],
  teamId?: number | null
): TeamRecord {
  const record: TeamRecord = { won: 0, drawn: 0, lost: 0 };

  if (teamId == null) {
    return record;
  }

  matches.filter(isPlayed).forEach((match) => {
    const isHome = match.home_team_id === teamId;
    const isAway = match.away_team_id === teamId;

    if (!isHome && !isAway) {
      return;
    }

    const scored = (isHome ? match.home_score : match.away_score) as number;
    const conceded = (isHome ? match.away_score : match.home_score) as number;

    if (scored > conceded) {
      record.won += 1;
    } else if (scored === conceded) {
      record.drawn += 1;
    } else {
      record.lost += 1;
    }
  });

  return record;
}

export function formatRecord({ won, drawn, lost }: TeamRecord): string {
  return `${won}T ${drawn}H ${lost}B`;
}

const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  finished: 'Đã kết thúc',
};

export function getCompetitionStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function getCompetitionMeta(
  competition: Competition,
  teamCount?: number
): string {
  const parts = [
    competition.legs === 2 ? 'Vòng tròn hai lượt' : 'Vòng tròn một lượt',
  ];

  const teams = teamCount ?? competition.team_count;
  if (teams) {
    parts.push(`${teams} đội`);
  }
  if (competition.venue) {
    parts.push(competition.venue);
  }

  return parts.join(' · ');
}
