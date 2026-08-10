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
      <div className='flex items-center gap-5'>
        {canEditAvatar ? (
          <AvatarUpload
            userId={player.id}
            name={name}
            avatarUrl={player.avatar_url}
            className='h-[72px] w-[72px]'
            fallbackClassName='text-xl'
          />
        ) : (
          <PlayerAvatar
            name={name}
            avatarUrl={player.avatar_url}
            className='h-[72px] w-[72px] flex-none'
            fallbackClassName='text-xl'
          />
        )}
        <div className='flex-1 min-w-0'>
          <h2 className='text-2xl font-bold tracking-tight'>{name}</h2>
          <p className='text-muted-foreground'>
            Số {player.shirt_number ?? '–'} ·{' '}
            {getPositionLabel(player.position)}
          </p>
        </div>
        {isAdmin && !isEditing ? (
          <Button variant='outline' onClick={() => setIsEditing(true)}>
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
