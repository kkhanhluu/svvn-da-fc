'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { CreateCompetitionForm } from './create-competition-form';

export function CompetitionsHeader({ isAdmin }: { isAdmin: boolean }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className='mb-5 flex items-center justify-between gap-4 sm:mb-6 sm:items-start sm:gap-6'>
        <div>
          <h2 className='text-[22px] font-semibold tracking-tight sm:text-2xl sm:font-bold'>
            Giải đấu
          </h2>
          {/* The blurb is desktop-only: on a phone the list itself should be
              the first thing below the title. */}
          <p className='hidden text-muted-foreground sm:block'>
            Các giải đấu mà FC SVVN Darmstadt tham gia. Chỉ admin có quyền tạo
            và chỉnh sửa.
          </p>
        </div>
        {isAdmin && !isCreating ? (
          <>
            <Button
              size='icon'
              aria-label='Tạo giải đấu'
              className='h-11 w-11 flex-none rounded-full sm:hidden'
              onClick={() => setIsCreating(true)}
            >
              <Plus className='h-5 w-5' />
            </Button>
            <Button
              className='hidden sm:inline-flex'
              onClick={() => setIsCreating(true)}
            >
              Tạo giải đấu
            </Button>
          </>
        ) : null}
      </div>
      {isCreating ? (
        <CreateCompetitionForm onCreated={() => setIsCreating(false)} />
      ) : null}
    </div>
  );
}
