'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { CreateEventForm } from './create-event-form';

export function EventsHeader() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className='flex items-center justify-between space-y-2 mb-8'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Xin chào admin!</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách các buổi đá bóng của đội bóng SVVN Darmstadt
            trong tuần này.
          </p>
        </div>
        {!isCreating ? (
          <>
            <Button
              size='icon'
              aria-label='Tạo buổi đá bóng'
              className='h-11 w-11 flex-none rounded-full sm:hidden'
              onClick={() => setIsCreating(true)}
            >
              <Plus className='h-5 w-5' />
            </Button>
            <Button
              className='hidden sm:inline-flex'
              onClick={() => setIsCreating(true)}
            >
              Tạo buổi đá bóng
            </Button>
          </>
        ) : null}
      </div>
      {isCreating ? (
        <CreateEventForm onCreated={() => setIsCreating(false)} />
      ) : null}
    </div>
  );
}
