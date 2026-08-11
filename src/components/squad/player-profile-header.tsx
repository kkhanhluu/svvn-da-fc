'use client';

import { useState } from 'react';
import { getPositionLabel } from '../../helpers/getPositionLabel';
import { getFullName } from '../../helpers/playerName';
import { UserProfile } from '../../types';
import { AvatarUpload } from '../avatar-upload';
import { PlayerAvatar } from '../player-avatar';
import { Button } from '../ui/button';
import { EditPlayerForm } from './edit-player-form';

export function PlayerProfileHeader({
  player,
  isAdmin,
  canEditAvatar,
}: {
  player: UserProfile;
  isAdmin: boolean;
  canEditAvatar: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const name = getFullName(player);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4 sm:gap-5'>
        {canEditAvatar ? (
          <AvatarUpload
            userId={player.id}
            name={name}
            avatarUrl={player.avatar_url}
            className='h-16 w-16 sm:h-[72px] sm:w-[72px]'
            fallbackClassName='text-lg sm:text-xl'
          />
        ) : (
          <PlayerAvatar
            name={name}
            avatarUrl={player.avatar_url}
            className='h-16 w-16 flex-none sm:h-[72px] sm:w-[72px]'
            fallbackClassName='text-lg sm:text-xl'
          />
        )}
        <div className='min-w-0 flex-1'>
          <h2 className='truncate text-xl font-semibold tracking-tight sm:text-2xl sm:font-bold'>
            {name}
          </h2>
          <p className='truncate text-[13px] text-muted-foreground sm:text-base'>
            Số {player.shirt_number ?? '–'} ·{' '}
            {getPositionLabel(player.position)}
          </p>
        </div>
        {isAdmin && !isEditing ? (
          <Button
            variant='outline'
            size='sm'
            className='flex-none sm:h-10 sm:px-4'
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        ) : null}
      </div>

      {isEditing ? (
        <EditPlayerForm player={player} onDone={() => setIsEditing(false)} />
      ) : null}
    </div>
  );
}
