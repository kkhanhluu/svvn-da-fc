import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Database } from '../../../../../../../database.types';
import { TabLinks } from '../../../../../../components/competitions/tab-links';
import { DetailItem } from '../../../../../../components/detail-list';
import { SoccerBall } from '../../../../../../components/icons/soccer-ball';
import {
  hasLineupPlayers,
  Lineups,
} from '../../../../../../components/matches/lineups';
import {
  MatchEventWithPlayers,
  MatchSummary,
} from '../../../../../../components/matches/match-summary';
import {
  MotmCandidate,
  MotmVote,
} from '../../../../../../components/matches/motm-vote';
import {
  buildSideLineups,
  LineupRow,
} from '../../../../../../helpers/buildLineups';
import { isPlayed } from '../../../../../../helpers/competition';
import { getCurrentProfile } from '../../../../../../helpers/getCurrentProfile';
import { getFullName, getTeamAbbr } from '../../../../../../helpers/playerName';
import { cn } from '../../../../../../lib/utils';
import { CompetitionTeam, UserProfile } from '../../../../../../types';

const EVENT_SELECT =
  '*, player:users!match_events_player_user_id_fkey(first_name, last_name), assist:users!match_events_assist_user_id_fkey(first_name, last_name)';

const LINEUP_SELECT =
  '*, users(first_name, last_name, position, shirt_number, avatar_url)';

/** Caption under the score: "Svvnda thắng" reads better than "Kết thúc". */
function getOutcomeLabel(
  match: { home_score: number | null; away_score: number | null },
  homeTeam?: CompetitionTeam,
  awayTeam?: CompetitionTeam
): string {
  const homeScore = match.home_score ?? 0;
  const awayScore = match.away_score ?? 0;

  if (homeScore === awayScore) {
    return 'Hòa';
  }

  const winner = homeScore > awayScore ? homeTeam : awayTeam;
  return winner ? `${winner.name} thắng` : 'Kết thúc';
}

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: { id: string; matchId: string };
  searchParams: { tab?: string; view?: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const competitionId = Number(params.id);
  const matchId = Number(params.matchId);
  const activeTab = searchParams.tab ?? 'summary';
  const lineupView = searchParams.view ?? 'pitch';

  const profile = await getCurrentProfile(supabase);

  const { data: match } = await supabase
    .from('matches')
    .select('*, competitions(id, name)')
    .eq('id', matchId)
    .single();

  if (!match) {
    notFound();
  }

  const { data: teamRows } = await supabase
    .from('competition_teams')
    .select('*')
    .eq('competition_id', competitionId);

  const teams = (teamRows ?? []) as CompetitionTeam[];
  const homeTeam = teams.find((team) => team.id === match.home_team_id);
  const awayTeam = teams.find((team) => team.id === match.away_team_id);

  // Every lineup entry and event of this match belongs to one of these two.
  const matchTeams = [homeTeam, awayTeam].filter(
    (team): team is CompetitionTeam => team != null
  );

  const isAdmin = profile?.role === 'ADMIN';

  // Only the event editor needs the squad, and only an admin ever sees it.
  const { data: memberRows } = isAdmin
    ? await supabase
        .from('users')
        .select('*')
        .order('shirt_number', { ascending: true, nullsFirst: false })
    : { data: null };

  const { data: eventRows, error: eventsError } = await supabase
    .from('match_events')
    .select(EVENT_SELECT)
    .eq('match_id', matchId)
    .order('minute', { ascending: true, nullsFirst: false });

  const events = (eventRows ?? []) as unknown as MatchEventWithPlayers[];

  // Goal scorers shown next to the score, minute order per side (`events`
  // is already sorted by minute). Own goals are left out, the same way the
  // squad's personal goal tallies exclude them elsewhere.
  const goalScorers = (teamId?: number) =>
    events
      .filter((event) => event.type === 'goal' && event.competition_team_id === teamId)
      .map((event) => ({
        id: event.id,
        name: event.player ? getFullName(event.player) : event.player_name ?? '',
        minute: event.minute,
      }));

  const homeGoals = goalScorers(homeTeam?.id);
  const awayGoals = goalScorers(awayTeam?.id);

  const { data: lineupRows, error: lineupsError } = await supabase
    .from('match_lineups')
    .select(LINEUP_SELECT)
    .eq('match_id', matchId);

  const lineups = (lineupRows ?? []) as unknown as LineupRow[];

  // A failed select yields null data, which is indistinguishable from an empty
  // match once it reaches the components — surface it in the server log instead.
  if (eventsError) {
    console.error('Không tải được diễn biến trận đấu', eventsError);
  }
  if (lineupsError) {
    console.error('Không tải được đội hình ra sân', lineupsError);
  }

  const sides = buildSideLineups(
    matchTeams.map((team) => ({ id: team.id, name: team.name })),
    lineups,
    events
  );

  const { data: votes } = await supabase
    .from('motm_votes')
    .select('voter_id, player_user_id, player_name')
    .eq('match_id', matchId);

  const tabs = [
    { key: 'summary', label: 'Tổng quan' },
    { key: 'lineups', label: 'Đội hình ra sân' },
  ].map((tab) => ({
    ...tab,
    href: `/competitions/${competitionId}/matches/${matchId}?tab=${tab.key}`,
  }));

  const lineupViewTabs = [
    { key: 'pitch', label: 'Sơ đồ' },
    { key: 'list', label: 'Danh sách' },
  ].map((tab) => ({
    ...tab,
    href: `/competitions/${competitionId}/matches/${matchId}?tab=lineups&view=${tab.key}`,
  }));

  const infoItems: DetailItem[] = [
    { label: 'Ngày', value: format(new Date(match.match_date), 'dd/MM/yyyy') },
  ];
  if (match.kickoff_time) {
    infoItems.push({ label: 'Giờ', value: match.kickoff_time.slice(0, 5) });
  }
  if (match.round != null) {
    infoItems.push({ label: 'Vòng', value: `Vòng ${match.round}` });
  }
  if (match.venue) {
    infoItems.push({ label: 'Sân', value: match.venue });
  }
  if (match.referee) {
    infoItems.push({ label: 'Trọng tài', value: match.referee });
  }

  // Only our own players can win man of the match; fall back to everyone who
  // played when the club side has not been flagged on the competition.
  const ownTeamIds = teams
    .filter((team) => team.is_own_team)
    .map((team) => team.id);
  const candidateSides = sides.filter(
    (side) => ownTeamIds.length === 0 || ownTeamIds.includes(side.teamId)
  );
  const candidates: MotmCandidate[] = candidateSides
    .flatMap((side) => [...side.starters, ...side.bench])
    .map((player) => ({
      key: player.key,
      name: player.name,
      userId: player.userId,
    }));

  const played = isPlayed(match);
  const homeWon = played && (match.home_score ?? 0) > (match.away_score ?? 0);
  const awayWon = played && (match.away_score ?? 0) > (match.home_score ?? 0);

  return (
    <div className='flex min-h-full flex-1 flex-col space-y-5 p-5 sm:space-y-6 sm:p-8 md:p-16'>
      <Link
        href={`/competitions/${competitionId}`}
        // flex-none: `truncate` zeroes the automatic minimum size, so without
        // it this row collapses when the page runs taller than the viewport.
        className='flex-none truncate text-sm text-muted-foreground hover:text-foreground'
      >
        ← {match.competitions?.name ?? 'Giải đấu'}
      </Link>

      {/* Phone: crest above team name on each side, score in a tinted box in
          the middle. Desktop keeps the single centred row. */}
      <div className='grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-3 sm:flex sm:gap-6 md:gap-10'>
        <div className='flex min-w-0 flex-1 flex-col-reverse items-center gap-2 sm:flex-row sm:justify-end sm:gap-3'>
          <span
            className={cn(
              'w-full truncate text-center text-sm font-semibold sm:w-auto sm:text-right sm:text-lg',
              homeWon && 'text-green-600',
              awayWon && 'text-muted-foreground'
            )}
          >
            {homeTeam?.name}
          </span>
          <span className='flex h-12 w-12 flex-none items-center justify-center rounded-[10px] bg-muted text-sm font-semibold text-muted-foreground sm:h-10 sm:w-10 sm:rounded-lg sm:text-xs'>
            {homeTeam ? getTeamAbbr(homeTeam.name, homeTeam.abbr) : ''}
          </span>
        </div>
        <div className='text-center'>
          <p
            className={cn(
              'inline-flex items-baseline gap-2 whitespace-nowrap rounded-[10px] px-3.5 py-1 text-3xl font-bold tracking-tight sm:gap-0 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0',
              played && (homeWon || awayWon)
                ? 'bg-green-50'
                : 'bg-muted'
            )}
          >
            {played ? (
              <>
                <span className={cn(homeWon && 'text-green-600')}>
                  {match.home_score}
                </span>
                <span className='text-xl text-muted-foreground sm:text-3xl'>
                  {' – '}
                </span>
                <span className={cn(awayWon && 'text-green-600')}>
                  {match.away_score}
                </span>
              </>
            ) : (
              'vs'
            )}
          </p>
          <p
            className={cn(
              'mt-1.5 whitespace-nowrap text-xs font-medium sm:mt-0 sm:text-sm sm:font-normal sm:text-muted-foreground',
              homeWon || awayWon ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {played ? getOutcomeLabel(match, homeTeam, awayTeam) : 'Chưa diễn ra'}
            {match.round != null ? (
              <span className='hidden sm:inline'>{` · Vòng ${match.round}`}</span>
            ) : null}
          </p>
        </div>
        <div className='flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:gap-3'>
          <span className='flex h-12 w-12 flex-none items-center justify-center rounded-[10px] bg-muted text-sm font-semibold text-muted-foreground sm:h-10 sm:w-10 sm:rounded-lg sm:text-xs'>
            {awayTeam ? getTeamAbbr(awayTeam.name, awayTeam.abbr) : ''}
          </span>
          <span
            className={cn(
              'w-full truncate text-center text-sm font-semibold sm:w-auto sm:text-left sm:text-lg',
              awayWon && 'text-green-600',
              homeWon && 'text-muted-foreground'
            )}
          >
            {awayTeam?.name}
          </span>
        </div>
      </div>

      {homeGoals.length > 0 || awayGoals.length > 0 ? (
        <div className='-mt-2 grid grid-cols-[1fr_auto_1fr] items-start justify-center gap-3 sm:flex sm:gap-6 md:gap-10'>
          <div className='flex flex-1 flex-col items-end gap-0.5'>
            {homeGoals.map((goal) => (
              <p
                key={goal.id}
                className='flex items-center gap-1 truncate text-xs text-muted-foreground'
              >
                {goal.name} {goal.minute != null ? `${goal.minute}'` : ''}
                <SoccerBall className='h-3 w-3 flex-none' />
              </p>
            ))}
          </div>
          <div className='w-12 flex-none sm:w-10' />
          <div className='flex flex-1 flex-col items-start gap-0.5'>
            {awayGoals.map((goal) => (
              <p
                key={goal.id}
                className='flex items-center gap-1 truncate text-xs text-muted-foreground'
              >
                <SoccerBall className='h-3 w-3 flex-none' />
                {goal.name} {goal.minute != null ? `${goal.minute}'` : ''}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <TabLinks tabs={tabs} activeKey={activeTab} fill />
        {activeTab === 'lineups' && hasLineupPlayers(sides) ? (
          <TabLinks tabs={lineupViewTabs} activeKey={lineupView} fill />
        ) : null}
      </div>

      {activeTab === 'lineups' ? (
        <Lineups sides={sides} view={lineupView} />
      ) : (
        <MatchSummary
          matchId={matchId}
          events={events}
          teams={matchTeams}
          members={(memberRows ?? []) as UserProfile[]}
          canEdit={isAdmin}
          infoItems={infoItems}
          motm={
            profile ? (
              <MotmVote
                matchId={matchId}
                candidates={candidates}
                votes={votes ?? []}
                currentUserId={profile.id}
              />
            ) : null
          }
        />
      )}
    </div>
  );
}
