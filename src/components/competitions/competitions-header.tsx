'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { CreateCompetitionForm } from './create-competition-form';

export function CompetitionsHeader({ isAdmin }: { isAdmin: boolean }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className='flex items-start justify-between gap-6 mb-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Giải đấu</h2>
          <p className='text-muted-foreground'>
            Các giải đấu mà FC SVVN Darmstadt tham gia. Chỉ admin có quyền tạo
            và chỉnh sửa.
          </p>
        </div>
        {isAdmin && !isCreating ? (
          <Button onClick={() => setIsCreating(true)}>Tạo giải đấu</Button>
        ) : null}
      </div>
      {isCreating ? (
        <CreateCompetitionForm onCreated={() => setIsCreating(false)} />
      ) : null}
    </div>
  );
}
