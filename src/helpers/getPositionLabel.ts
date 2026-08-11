export type PositionGroup =
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward';

const POSITION_LABELS: Record<PositionGroup, { full: string; short: string }> =
  {
    goalkeeper: { full: 'Thủ môn', short: 'TM' },
    defender: { full: 'Hậu vệ', short: 'HV' },
    midfielder: { full: 'Tiền vệ', short: 'TV' },
    forward: { full: 'Tiền đạo', short: 'TĐ' },
  };

/**
 * `users.position` is free text and has been written with different spellings
 * over time ('goalkeeper', 'keeper', stray whitespace), so normalise before use.
 * Unknown values fall back to midfielder, the position of most members.
 */
export function getPositionGroup(position?: string | null): PositionGroup {
  const normalized = (position ?? '').trim().toLowerCase();

  if (normalized.startsWith('goal') || normalized.startsWith('keeper')) {
    return 'goalkeeper';
  }
  if (normalized.startsWith('def')) {
    return 'defender';
  }
  if (normalized.startsWith('for') || normalized.startsWith('striker')) {
    return 'forward';
  }
  return 'midfielder';
}

/**
 * Unlike {@link getPositionGroup}, which must always land on a pitch row, the
 * label keeps "not set" distinct from midfielder — otherwise a position that
 * failed to save looks like a successful one.
 */
export function getPositionLabel(position?: string | null): string {
  if (!position?.trim()) {
    return 'Chưa rõ';
  }
  return POSITION_LABELS[getPositionGroup(position)].full;
}

export function getShortPositionLabel(position?: string | null): string {
  if (!position?.trim()) {
    return '—';
  }
  return POSITION_LABELS[getPositionGroup(position)].short;
}

export const POSITION_OPTIONS = (
  Object.keys(POSITION_LABELS) as PositionGroup[]
).map((value) => ({ value, label: POSITION_LABELS[value].full }));
