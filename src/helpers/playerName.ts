import { getPositionLabel } from './getPositionLabel';

interface NamedUser {
  first_name?: string | null;
  last_name?: string | null;
}

interface SearchableMember extends NamedUser {
  shirt_number?: number | null;
  position?: string | null;
}

export function getFullName(user?: NamedUser | null): string {
  return [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
}

/** Squad pickers all search the same three things: name, shirt number, position. */
export function searchMembers<T extends SearchableMember>(
  members: T[],
  query: string
): T[] {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return members;
  }

  return members.filter(
    (member) =>
      getFullName(member).toLowerCase().includes(needle) ||
      String(member.shirt_number ?? '') === needle ||
      getPositionLabel(member.position).toLowerCase().includes(needle)
  );
}

/** Vietnamese names put the given name last, so the last two words identify a player. */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Shown in the square tile next to a team or competition name when no
 * abbreviation was entered. Unlike people, teams read from the front
 * ('Lôm côm' → LC, 'Svvnda' → SV), and year suffixes carry no meaning.
 */
export function getTeamAbbr(name: string, abbr?: string | null): string {
  if (abbr?.trim()) {
    return abbr.trim().toUpperCase();
  }

  const words = name
    .split(' ')
    .filter((word) => word && !/^\d+$/.test(word));

  if (words.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}
