import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import {
  CompetitionList,
  CompetitionWithTeams,
} from '../../../components/competitions/competition-list';
import { CompetitionsHeader } from '../../../components/competitions/competitions-header';
import { getCurrentProfile } from '../../../helpers/getCurrentProfile';

export default async function CompetitionsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const profile = await getCurrentProfile(supabase);

  const { data: competitions } = await supabase
    .from('competitions')
    .select('*, competition_teams(id, name, is_own_team)')
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  const { data: matches } = await supabase
    .from('matches')
    .select(
      'competition_id, home_team_id, away_team_id, home_score, away_score, status'
    );

  return (
    <div className='flex h-full flex-1 flex-col space-y-5 p-5 sm:space-y-8 sm:p-8 md:p-16'>
      <CompetitionsHeader isAdmin={profile?.role === 'ADMIN'} />
      <CompetitionList
        competitions={(competitions ?? []) as CompetitionWithTeams[]}
        matches={matches ?? []}
      />
    </div>
  );
}
