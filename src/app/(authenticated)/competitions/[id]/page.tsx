import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Database } from '../../../../../database.types';
import { InfoList } from '../../../../components/competitions/info-list';
import { MatchesTab } from '../../../../components/competitions/matches-tab';
import { ScorersTable } from '../../../../components/competitions/scorers-table';
import { StandingsTable } from '../../../../components/competitions/standings-table';
import { TabLinks } from '../../../../components/competitions/tab-links';
import { Button } from '../../../../components/ui/button';
import { getCompetitionMeta } from '../../../../helpers/competition';
import { getCurrentProfile } from '../../../../helpers/getCurrentProfile';
import { getTeamAbbr } from '../../../../helpers/playerName';
import { CompetitionTeam, MatchWithTeams } from '../../../../types';

const MATCH_WITH_TEAMS_SELECT =
  '*, home_team:competition_teams!matches_home_team_id_fkey(id, name, abbr, is_own_team), away_team:competition_teams!matches_away_team_id_fkey(id, name, abbr, is_own_team)';

export default async function CompetitionDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const competitionId = Number(params.id);
  const activeTab = searchParams.tab ?? 'matches';

  const profile = await getCurrentProfile(supabase);

  const { data: competition } = await supabase
    .from('competitions')
    .select('*, competition_teams(*)')
    .eq('id', competitionId)
    .single();

  if (!competition) {
    notFound();
  }

  const teams = (competition.competition_teams ?? []) as CompetitionTeam[];

  const tabs = [
    { key: 'matches', label: 'Trận đấu' },
    { key: 'standings', label: 'Bảng xếp hạng' },
    { key: 'scorers', label: 'Vua phá lưới' },
    { key: 'info', label: 'Thông tin' },
  ].map((tab) => ({
    ...tab,
    href: `/competitions/${competitionId}?tab=${tab.key}`,
  }));

  return (
    <div className='flex h-full flex-1 flex-col space-y-5 p-5 sm:space-y-6 sm:p-8 md:p-16'>
      <Link
        href='/competitions'
        className='text-sm text-muted-foreground hover:text-foreground'
      >
        ← Giải đấu
      </Link>

      <div className='flex items-center gap-3 sm:gap-4'>
        <div className='flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-muted text-[13px] font-semibold text-muted-foreground sm:h-12 sm:w-12 sm:text-sm'>
          {getTeamAbbr(competition.name)}
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='truncate text-[17px] font-semibold tracking-tight sm:text-2xl sm:font-bold'>
            {competition.name}
          </h2>
          <p className='truncate text-[13px] text-muted-foreground sm:text-base'>
            {getCompetitionMeta(competition, teams.length)}
          </p>
        </div>
        {profile?.role === 'ADMIN' ? (
          <Button asChild size='sm' className='flex-none sm:h-10 sm:px-4'>
            <Link href={`/competitions/${competitionId}/matches/new`}>
              <span className='sm:hidden'>+ Trận</span>
              <span className='hidden sm:inline'>Thêm trận đấu</span>
            </Link>
          </Button>
        ) : null}
      </div>

      <TabLinks tabs={tabs} activeKey={activeTab} />

      {activeTab === 'matches' ? (
        <MatchesTabContent competitionId={competitionId} />
      ) : null}
      {activeTab === 'standings' ? (
        <StandingsTabContent competitionId={competitionId} />
      ) : null}
      {activeTab === 'scorers' ? (
        <ScorersTabContent competitionId={competitionId} />
      ) : null}
      {activeTab === 'info' ? (
        <InfoList competition={competition} teamCount={teams.length} />
      ) : null}
    </div>
  );
}

async function MatchesTabContent({ competitionId }: { competitionId: number }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: matches } = await supabase
    .from('matches')
    .select(MATCH_WITH_TEAMS_SELECT)
    .eq('competition_id', competitionId)
    .order('round', { ascending: false, nullsFirst: false })
    .order('match_date', { ascending: false });

  return (
    <MatchesTab
      matches={(matches ?? []) as unknown as MatchWithTeams[]}
      competitionId={competitionId}
    />
  );
}

async function StandingsTabContent({
  competitionId,
}: {
  competitionId: number;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: standings } = await supabase.rpc('get_competition_standings', {
    p_competition_id: competitionId,
  });

  return <StandingsTable standings={standings ?? []} />;
}

async function ScorersTabContent({ competitionId }: { competitionId: number }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: scorers } = await supabase.rpc('get_competition_scorers', {
    p_competition_id: competitionId,
  });

  return <ScorersTable scorers={scorers ?? []} />;
}
