import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Database } from '../../../../../../../database.types';
import { MatchForm } from '../../../../../../components/matches/match-form';
import { getCurrentProfile } from '../../../../../../helpers/getCurrentProfile';
import { CompetitionTeam, UserProfile } from '../../../../../../types';

export default async function NewMatchPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const competitionId = Number(params.id);

  const profile = await getCurrentProfile(supabase);

  if (profile?.role !== 'ADMIN') {
    redirect(`/competitions/${competitionId}`);
  }

  const { data: competition } = await supabase
    .from('competitions')
    .select('*, competition_teams(*)')
    .eq('id', competitionId)
    .single();

  if (!competition) {
    notFound();
  }

  const { data: members } = await supabase
    .from('users')
    .select('*')
    .order('shirt_number', { ascending: true, nullsFirst: false });

  return (
    <div className='h-full flex-1 flex-col space-y-6 p-8 md:p-16 flex'>
      <Link
        href={`/competitions/${competitionId}`}
        className='text-sm text-muted-foreground hover:text-foreground'
      >
        ← {competition.name}
      </Link>

      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Thêm trận đấu</h2>
        <p className='text-muted-foreground'>
          Nhập kết quả và người ghi bàn — bảng xếp hạng sẽ tự động cập nhật.
        </p>
      </div>

      <MatchForm
        competitionId={competitionId}
        teams={(competition.competition_teams ?? []) as CompetitionTeam[]}
        members={(members ?? []) as UserProfile[]}
        defaultVenue={competition.venue}
      />
    </div>
  );
}
