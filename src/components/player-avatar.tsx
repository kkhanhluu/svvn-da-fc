import { getInitials } from '../helpers/playerName';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

/**
 * Photo of a player, falling back to their initials. Opponents have no user
 * record and therefore never have a photo, so the fallback is the common case.
 */
export function PlayerAvatar({
  name,
  avatarUrl,
  className,
  fallbackClassName,
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {avatarUrl ? (
        // Portraits are cropped to a square; centering the crop tends to cut
        // off foreheads, so anchor to the top instead — faces sit there far
        // more often than at the bottom.
        <AvatarImage src={avatarUrl} alt={name} className='object-top' />
      ) : null}
      <AvatarFallback
        className={cn(
          'text-[11px] font-semibold text-muted-foreground',
          fallbackClassName
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
