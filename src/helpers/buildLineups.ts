import { getFullName } from './playerName';
import { getPositionGroup, PositionGroup } from './getPositionLabel';

/** Only club members are named on a lineup, so every row carries its user. */
export interface LineupRow {
  id: number;
  competition_team_id: number;
  user_id: string;
  is_starter: boolean;
  users: {
    first_name: string | null;
    last_name: string | null;
    position: string | null;
    shirt_number: number | null;
    avatar_url: string | null;
  };
}

export interface ContributionRow {
  type: string;
  player_user_id: string | null;
  player_name: string | null;
  assist_user_id: string | null;
  assist_name: string | null;
}

export interface LineupPlayer {
  key: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  shirtNumber: number | null;
  position: PositionGroup;
  goals: number;
  assists: number;
}

export interface SideLineup {
  teamId: number;
  teamName: string;
  starters: LineupPlayer[];
  bench: LineupPlayer[];
}

/** Club members are keyed by id, opponents by their name — the same pairing the tables use. */
export function getPlayerKey(
  userId?: string | null,
  playerName?: string | null
): string {
  return userId ?? playerName ?? '';
}

function countContributions(events: ContributionRow[]) {
  const goals = new Map<string, number>();
  const assists = new Map<string, number>();

  events
    .filter((event) => event.type === 'goal')
    .forEach((event) => {
      const scorer = getPlayerKey(event.player_user_id, event.player_name);
      if (scorer) {
        goals.set(scorer, (goals.get(scorer) ?? 0) + 1);
      }

      const assistant = getPlayerKey(event.assist_user_id, event.assist_name);
      if (assistant) {
        assists.set(assistant, (assists.get(assistant) ?? 0) + 1);
      }
    });

  return { goals, assists };
}

function toLineupPlayer(
  row: LineupRow,
  goals: Map<string, number>,
  assists: Map<string, number>
): LineupPlayer {
  // Events key our own players by id, the same way the lineup does.
  const key = row.user_id;

  return {
    key,
    userId: row.user_id,
    name: getFullName(row.users),
    avatarUrl: row.users.avatar_url,
    shirtNumber: row.users.shirt_number,
    position: getPositionGroup(row.users.position),
    goals: goals.get(key) ?? 0,
    assists: assists.get(key) ?? 0,
  };
}

const POSITION_ORDER: PositionGroup[] = [
  'goalkeeper',
  'defender',
  'midfielder',
  'forward',
];

function byPosition(a: LineupPlayer, b: LineupPlayer): number {
  return (
    POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position)
  );
}

export function buildSideLineups(
  teams: { id: number; name: string }[],
  lineups: LineupRow[],
  events: ContributionRow[]
): SideLineup[] {
  const { goals, assists } = countContributions(events);

  return teams.map((team) => {
    const players = lineups
      .filter((row) => row.competition_team_id === team.id)
      .map((row) => ({
        row,
        player: toLineupPlayer(row, goals, assists),
      }));

    return {
      teamId: team.id,
      teamName: team.name,
      starters: players
        .filter(({ row }) => row.is_starter)
        .map(({ player }) => player)
        .sort(byPosition),
      bench: players
        .filter(({ row }) => !row.is_starter)
        .map(({ player }) => player)
        .sort(byPosition),
    };
  });
}

/** Rows of the pitch, goalkeeper first — the order the formation is drawn in. */
export function groupByPositionRow(players: LineupPlayer[]): LineupPlayer[][] {
  return POSITION_ORDER.map((position) =>
    players.filter((player) => player.position === position)
  );
}

export function getFormation(players: LineupPlayer[]): string {
  return groupByPositionRow(players)
    .slice(1)
    .map((row) => row.length)
    .filter((count) => count > 0)
    .join('-');
}
