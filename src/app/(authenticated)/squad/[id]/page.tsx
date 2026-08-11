import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Database } from '../../../../../database.types';
import {
  PlayerMatchRow,
  PlayerProfile,
} from '../../../../components/squad/player-profile';
import { isPlayed } from '../../../../helpers/competition';
import { getCurrentProfile } from '../../../../helpers/getCurrentProfile';
import { UserProfile } from '../../../../types';

const RECENT_MATCHES_LIMIT = 5;

const APPEARANCE_SELECT =
  'competition_team_id, matches(id, competition_id, match_date, home_score, away_score, status, home_team_id, away_team_id, home_team:competition_teams!matches_home_team_id_fkey(name), away_team:competition_teams!matches_away_team_id_fkey(name))';

interface Appearance {
  competition_team_id: number;
  matches: {
    id: number;
    competition_id: number;
    match_date: string;
    home_score: number | null;
    away_score: number | null;
    status: string;
    home_team_id: number;
    away_team_id: number;
    home_team: { name: string } | null;
    away_team: { name: string } | null;
  } | null;
}

interface Contribution {
  match_id: number;
  player_user_id: string | null;
  assist_user_id: string | null;
}

function formatContribution(goals: number, assists: number): string {
  const parts = [];
  if (goals > 0) {
    parts.push(`${goals} bàn`);
  }
  if (assists > 0) {
    parts.push(`${assists} KT`);
  }
  return parts.join(' ') || '—';
}

function toMatchRow(
  appearance: Appearance,
  contributions: Contribution[],
  playerId: string
): PlayerMatchRow | null {
  const match = appearance.matches;
  if (!match) {
    return null;
  }

  const played = isPlayed(match);
  const isHome = appearance.competition_team_id === match.home_team_id;
  const scored = isHome ? match.home_score : match.away_score;
  const conceded = isHome ? match.away_score : match.home_score;

  let outcome: PlayerMatchRow['outcome'] = 'none';
  if (played) {
    if ((scored as number) > (conceded as number)) {
      outcome = 'win';
    } else if (scored === conceded) {
      outcome = 'draw';
    } else {
      outcome = 'loss';
    }
  }

  const matchContributions = contributions.filter(
    (contribution) => contribution.match_id === match.id
  );

  return {
    matchId: match.id,
    competitionId: match.competition_id,
    date: format(new Date(match.match_date), 'dd/MM/yy'),
    fixture: `${match.home_team?.name ?? '?'} – ${match.away_team?.name ?? '?'}`,
    score: played ? `${match.home_score}–${match.away_score}` : '—',
    outcome,
    contribution: formatContribution(
      matchContributions.filter((item) => item.player_user_id === playerId)
        .length,
      matchContributions.filter((item) => item.assist_user_id === playerId)
        .length
    ),
  };
}

export default async function PlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const profile = await getCurrentProfile(supabase);

  const { data: player } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!player) {
    notFound();
  }

  const { data: squadStats } = await supabase.rpc('get_squad_stats');
  const stats = squadStats?.find((row) => row.user_id === params.id);

  const { data: byCompetition } = await supabase.rpc(
    'get_player_competition_stats',
    { p_user_id: params.id }
  );

  const { count: motmVotes } = await supabase
    .from('motm_votes')
    .select('id', { count: 'exact', head: true })
    .eq('player_user_id', params.id);

  const { data: appearanceRows } = await supabase
    .from('match_lineups')
    .select(APPEARANCE_SELECT)
    .eq('user_id', params.id);

  const { data: contributionRows } = await supabase
    .from('match_events')
    .select('match_id, player_user_id, assist_user_id')
    .eq('type', 'goal')
    .or(`player_user_id.eq.${params.id},assist_user_id.eq.${params.id}`);

  const appearances = (appearanceRows ?? []) as unknown as Appearance[];
  const contributions = (contributionRows ?? []) as Contribution[];

  const recentMatches = appearances
    .filter((appearance) => appearance.matches != null)
    .sort((a, b) =>
      (b.matches?.match_date ?? '').localeCompare(a.matches?.match_date ?? '')
    )
    .slice(0, RECENT_MATCHES_LIMIT)
    .map((appearance) => toMatchRow(appearance, contributions, params.id))
    .filter((row): row is PlayerMatchRow => row != null);

  return (
    <div className='h-full flex-1 flex-col space-y-6 p-8 md:p-16 flex'>
      <Link
        href='/squad'
        className='text-sm text-muted-foreground hover:text-foreground'
      >
        ← Đội hình
      </Link>
      <PlayerProfile
        player={player as UserProfile}
        isAdmin={profile?.role === 'ADMIN'}
        // Storage lets a member replace their own photo, so allow it here too.
        canEditAvatar={
          profile?.role === 'ADMIN' || profile?.id === params.id
        }
        apps={stats?.apps ?? 0}
        goals={stats?.goals ?? 0}
        assists={stats?.assists ?? 0}
        motmVotes={motmVotes ?? 0}
        byCompetition={byCompetition ?? []}
        recentMatches={recentMatches}
      />
    </div>
  );
}
