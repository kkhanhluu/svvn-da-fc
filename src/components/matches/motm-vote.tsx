'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Database } from '../../../database.types';
import { getPlayerKey } from '../../helpers/buildLineups';
import {
  showErrorToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';

export interface MotmCandidate {
  key: string;
  name: string;
  userId: string | null;
}

interface Vote {
  voter_id: string;
  player_user_id: string | null;
  player_name: string | null;
}

export function MotmVote({
  matchId,
  candidates,
  votes,
  currentUserId,
}: {
  matchId: number;
  candidates: MotmCandidate[];
  votes: Vote[];
  currentUserId: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [currentVotes, setCurrentVotes] = useState<Vote[]>(votes);
  const [isVoting, setIsVoting] = useState(false);

  const myVote = currentVotes.find((vote) => vote.voter_id === currentUserId);
  const myVoteKey = myVote
    ? getPlayerKey(myVote.player_user_id, myVote.player_name)
    : null;

  const counts = new Map<string, number>();
  currentVotes.forEach((vote) => {
    const key = getPlayerKey(vote.player_user_id, vote.player_name);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const total = currentVotes.length;

  const ranked = [...candidates].sort(
    (a, b) => (counts.get(b.key) ?? 0) - (counts.get(a.key) ?? 0)
  );

  async function vote(candidate: MotmCandidate) {
    if (isVoting || candidate.key === myVoteKey) {
      return;
    }

    setIsVoting(true);

    const { error } = await supabase.from('motm_votes').upsert(
      {
        match_id: matchId,
        voter_id: currentUserId,
        player_user_id: candidate.userId,
        player_name: candidate.userId ? null : candidate.name,
      },
      { onConflict: 'match_id,voter_id' }
    );

    setIsVoting(false);

    if (error) {
      showErrorToast('Không lưu được bình chọn.');
      return;
    }

    setCurrentVotes([
      ...currentVotes.filter((item) => item.voter_id !== currentUserId),
      {
        voter_id: currentUserId,
        player_user_id: candidate.userId,
        player_name: candidate.userId ? null : candidate.name,
      },
    ]);
    showSuccessToast(`Đã bình chọn cho ${candidate.name}`);
    router.refresh();
  }

  if (candidates.length === 0) {
    return null;
  }

  return (
    <Card className='overflow-hidden'>
      <div className='flex items-center justify-between border-b px-4 py-3 sm:px-5 sm:py-3.5'>
        <p className='text-sm font-semibold'>Cầu thủ xuất sắc nhất</p>
        <p className='text-xs text-muted-foreground sm:text-sm'>
          {total} lượt
        </p>
      </div>
      <div className='divide-y'>
        {ranked.map((candidate) => {
          const count = counts.get(candidate.key) ?? 0;
          const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
          const isMyVote = candidate.key === myVoteKey;

          return (
            // Phone: name and share on one line with the bar underneath.
            // `sm:contents` flattens the wrapper back into one desktop row,
            // where `order` puts the bar between the name and the share.
            <button
              key={candidate.key}
              type='button'
              onClick={() => vote(candidate)}
              disabled={isVoting}
              className='block w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 sm:flex sm:items-center sm:gap-4 sm:px-5'
            >
              <span className='flex items-center justify-between gap-3 sm:contents'>
                <span
                  className={cn(
                    'min-w-0 truncate text-[13px] sm:order-1 sm:flex-1 sm:text-sm',
                    isMyVote && 'font-semibold'
                  )}
                >
                  {candidate.name}
                </span>
                <span className='flex-none text-[13px] text-muted-foreground sm:order-3 sm:w-10 sm:text-right sm:text-sm'>
                  {percentage}%
                </span>
              </span>
              <span className='mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-muted sm:order-2 sm:mt-0 sm:h-1.5 sm:w-24 sm:flex-none'>
                <span
                  className={cn(
                    'block h-full rounded-full',
                    isMyVote ? 'bg-primary' : 'bg-muted-foreground'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </span>
            </button>
          );
        })}
      </div>
      <p className='border-t px-4 py-3 text-xs text-muted-foreground sm:px-5 sm:text-sm'>
        {myVote
          ? `Bạn đã bình chọn cho ${
              ranked.find((candidate) => candidate.key === myVoteKey)?.name ??
              ''
            }.`
          : 'Chạm vào tên cầu thủ để bình chọn.'}
      </p>
    </Card>
  );
}
