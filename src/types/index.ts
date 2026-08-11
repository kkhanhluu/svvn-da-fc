import { Database } from '../../database.types';

export type UserProfile = Database['public']['Tables']['users']['Row'];
export type Training = Database['public']['Tables']['trainings']['Row'];
export type EventForAdmin =
  Database['public']['Functions']['get_events_for_admin']['Returns'][0] & {
    attendees: string[];
  };
export type EventWithTraining =
  Database['public']['Functions']['get_events_for_attendee']['Returns'][0] & {
    attendees: string[];
  };
export type Notification = Database['public']['Tables']['notifications']['Row'];

export type Competition = Database['public']['Tables']['competitions']['Row'];
export type CompetitionTeam =
  Database['public']['Tables']['competition_teams']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
export type MatchLineup = Database['public']['Tables']['match_lineups']['Row'];
export type MatchEvent = Database['public']['Tables']['match_events']['Row'];
export type MotmVote = Database['public']['Tables']['motm_votes']['Row'];

export type Standing =
  Database['public']['Functions']['get_competition_standings']['Returns'][0];
export type Scorer =
  Database['public']['Functions']['get_competition_scorers']['Returns'][0];
export type SquadPlayer =
  Database['public']['Functions']['get_squad_stats']['Returns'][0];
export type PlayerCompetitionStat =
  Database['public']['Functions']['get_player_competition_stats']['Returns'][0];

/** A match joined with both `competition_teams` rows, as rendered in lists. */
export type MatchWithTeams = Match & {
  home_team: Pick<CompetitionTeam, 'id' | 'name' | 'abbr' | 'is_own_team'>;
  away_team: Pick<CompetitionTeam, 'id' | 'name' | 'abbr' | 'is_own_team'>;
};
