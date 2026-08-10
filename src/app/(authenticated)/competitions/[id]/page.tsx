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
    <div className='h-full flex-1 flex-col space-y-6 p-8 md:p-16 flex'>
      <Link
        href='/competitions'
        className='text-sm text-muted-foreground hover:text-foreground'
      >
        ← Giải đấu
      </Link>

      <div className='flex items-center gap-4'>
        <div className='flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground'>
          {getTeamAbbr(competition.name)}
        </div>
        <div className='flex-1 min-w-0'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {competition.name}
          </h2>
          <p className='text-muted-foreground'>
            {getCompetitionMeta(competition, teams.length)}
          </p>
        </div>
        {profile?.role === 'ADMIN' ? (
          <Button asChild>
            <Link href={`/competitions/${competitionId}/matches/new`}>
              Thêm trận đấu
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
