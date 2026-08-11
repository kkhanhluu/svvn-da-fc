'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Camera, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';
import { Database } from '../../database.types';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../helpers/showNotifications';
import { cn } from '../lib/utils';
import { PlayerAvatar } from './player-avatar';

const AVATAR_BUCKET = 'avatars';
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

/** One object per player, replaced in place — the folder is what Storage authorises against. */
function getAvatarPath(userId: string): string {
  return `${userId}/avatar`;
}

/**
 * The avatar itself is the control: hovering (or focusing, or tapping on
 * touch devices, where the transparent overlay still covers the image)
 * reveals the camera button.
 */
export function AvatarUpload({
  userId,
  name,
  avatarUrl,
  className,
  fallbackClassName,
}: {
  userId: string;
  name: string;
  avatarUrl: string | null;
  className?: string;
  fallbackClassName?: string;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUrl, setCurrentUrl] = useState(avatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clear the input so picking the same file twice still fires a change.
    event.target.value = '';

    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      showErrorToast('Vui lòng chọn một tệp ảnh.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      showErrorToast('Ảnh không được lớn hơn 2 MB.');
      return;
    }

    setIsUploading(true);
    showLoadingToast('Đang tải ảnh lên...');

    const path = getAvatarPath(userId);
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setIsUploading(false);
      showErrorToast('Không tải được ảnh lên.');
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

    // The object keeps the same path, so the URL needs a version to defeat the CDN cache.
    const versionedUrl = `${publicUrl}?v=${Date.now()}`;

    // See edit-player-form: a row level security no-op reports no error, so
    // check that a row actually came back.
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: versionedUrl })
      .eq('id', userId)
      .select('id');

    setIsUploading(false);

    if (updateError || !updated || updated.length === 0) {
      showErrorToast('Đã tải ảnh lên nhưng không lưu được vào hồ sơ.');
      return;
    }

    setCurrentUrl(versionedUrl);
    showSuccessToast('Cập nhật ảnh thành công');
    router.refresh();
  }

  async function removeAvatar() {
    setIsUploading(true);
    showLoadingToast('Đang xoá ảnh...');

    await supabase.storage.from(AVATAR_BUCKET).remove([getAvatarPath(userId)]);

    const { data: updated, error } = await supabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', userId)
      .select('id');

    setIsUploading(false);

    if (error || !updated || updated.length === 0) {
      showErrorToast('Không xoá được ảnh.');
      return;
    }

    setCurrentUrl(null);
    showSuccessToast('Đã xoá ảnh');
    router.refresh();
  }

  return (
    <div className={cn('group relative flex-none', className)}>
      <PlayerAvatar
        name={name}
        avatarUrl={currentUrl}
        className='h-full w-full'
        fallbackClassName={fallbackClassName}
      />

      <button
        type='button'
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        aria-label={currentUrl ? 'Đổi ảnh đại diện' : 'Tải ảnh đại diện lên'}
        title={currentUrl ? 'Đổi ảnh đại diện' : 'Tải ảnh đại diện lên'}
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity',
          'group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isUploading && 'opacity-100'
        )}
      >
        {isUploading ? (
          <Loader2 className='h-5 w-5 animate-spin' />
        ) : (
          <Camera className='h-5 w-5' />
        )}
      </button>

      {currentUrl && !isUploading ? (
        <button
          type='button'
          onClick={removeAvatar}
          aria-label='Xoá ảnh đại diện'
          title='Xoá ảnh đại diện'
          className='absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <X className='h-3.5 w-3.5' />
        </button>
      ) : null}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
}
