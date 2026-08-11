'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getFullName, searchMembers } from '../../helpers/playerName';
import { cn } from '../../lib/utils';
import { UserProfile } from '../../types';
import { Input } from '../ui/input';

/**
 * A squad dropdown that filters as you type — the club is long enough that
 * scrolling a plain select to find one player is the slow way round.
 */
export function PlayerPicker({
  members,
  value,
  onChange,
  placeholder,
  noneLabel,
}: {
  members: UserProfile[];
  /** The selected member id, or '' for nobody. */
  value: string;
  onChange: (memberId: string) => void;
  placeholder: string;
  /** Shown as the first option when picking nobody is allowed. */
  noneLabel?: string;
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = members.find((member) => member.id === value);
  const matches = searchMembers(members, query);

  // The list is rendered in a portal so a scroll-clipped ancestor (the match
  // events card uses overflow-hidden for its rounded corners) can't cut it
  // off, which means its position has to be tracked in fixed coordinates.
  useLayoutEffect(() => {
    if (!isOpen || !inputRef.current) {
      return;
    }

    function updateRect() {
      const bounds = inputRef.current!.getBoundingClientRect();
      setRect({ top: bounds.bottom, left: bounds.left, width: bounds.width });
    }

    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isOpen]);

  function pick(memberId: string) {
    onChange(memberId);
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div className='relative'>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        role='combobox'
        aria-expanded={isOpen}
        value={isOpen ? query : selected ? getFullName(selected) : ''}
        onFocus={() => {
          setQuery('');
          setIsOpen(true);
        }}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      />

      {isOpen && rect
        ? createPortal(
            // Picking an option blurs the input, which would close the list
            // before the click lands, so keep focus on mouse down instead.
            <div
              role='listbox'
              onMouseDown={(event) => event.preventDefault()}
              style={{ top: rect.top + 4, left: rect.left, width: rect.width }}
              className='fixed z-50 max-h-56 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md'
            >
              {noneLabel ? (
                <button
                  type='button'
                  role='option'
                  aria-selected={value === ''}
                  onClick={() => pick('')}
                  className='flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground'
                >
                  {noneLabel}
                </button>
              ) : null}

              {matches.length === 0 ? (
                <p className='px-2 py-1.5 text-sm text-muted-foreground'>
                  Không tìm thấy cầu thủ nào.
                </p>
              ) : (
                matches.map((member) => (
                  <button
                    key={member.id}
                    type='button'
                    role='option'
                    aria-selected={member.id === value}
                    onClick={() => pick(member.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                      member.id === value && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <span className='w-5 flex-none text-xs text-muted-foreground'>
                      {member.shirt_number ?? '–'}
                    </span>
                    <span className='truncate'>{getFullName(member)}</span>
                  </button>
                ))
              )}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
