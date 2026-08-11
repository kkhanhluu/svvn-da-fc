'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Footprints, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Database } from '../../../database.types';
import { getFullName, getTeamAbbr } from '../../helpers/playerName';
import {
  showErrorToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import { CompetitionTeam, MatchEvent, UserProfile } from '../../types';
import { SoccerBall } from '../icons/soccer-ball';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PlayerPicker } from './player-picker';

const EVENT_TYPES = [
  'goal',
  'own_goal',
  'substitution',
  'yellow_card',
  'red_card',
] as const;

type EventType = (typeof EVENT_TYPES)[number];

const EVENT_LABELS: Record<EventType, string> = {
  goal: 'Bàn thắng',
  own_goal: 'Phản lưới',
  substitution: 'Thay người',
  yellow_card: 'Thẻ vàng',
  red_card: 'Thẻ đỏ',
};

type NamedUser = { first_name: string | null; last_name: string | null };

export type MatchEventWithPlayers = MatchEvent & {
  player: NamedUser | null;
  assist: NamedUser | null;
};

/**
 * `assist_user_id` / `assist_name` carry the second player on an event: who
 * assisted a goal, or who came off for a substitution. Types with no second
 * player use the free text note instead.
 */
function getPartnerLabel(type: EventType): string | null {
  if (type === 'goal') {
    return 'Kiến tạo';
  }
  if (type === 'substitution') {
    return 'Thay cho';
  }
  return null;
}

function getPlayerName(event: MatchEventWithPlayers): string {
  return event.player ? getFullName(event.player) : event.player_name ?? '';
}

function getPartnerName(event: MatchEventWithPlayers): string {
  return event.assist ? getFullName(event.assist) : event.assist_name ?? '';
}

function getEventTitle(event: MatchEventWithPlayers): string {
  const name = getPlayerName(event);
  return event.type === 'substitution' ? `${name} vào sân` : name;
}

function getEventDetail(event: MatchEventWithPlayers): string | null {
  const partner = getPartnerName(event);

  if (event.type === 'goal') {
    return `Kiến tạo: ${partner || '—'}`;
  }
  if (event.type === 'substitution') {
    return partner ? `Thay ${partner}` : null;
  }
  return event.note;
}

interface EventDraft {
  minute: string;
  type: EventType;
  teamId: string;
  playerId: string;
  playerName: string;
  partnerId: string;
  partnerName: string;
  note: string;
}

function createDraft(teamId: string): EventDraft {
  return {
    minute: '',
    type: 'goal',
    teamId,
    playerId: '',
    playerName: '',
    partnerId: '',
    partnerName: '',
    note: '',
  };
}

export function MatchEvents({
  matchId,
  events,
  teams,
  members,
  canEdit,
}: {
  matchId: number;
  events: MatchEventWithPlayers[];
  /** The two teams of this match — every event belongs to one of them. */
  teams: CompetitionTeam[];
  members: UserProfile[];
  canEdit: boolean;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const ownTeam = teams.find((team) => team.is_own_team);
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateDraft(changes: Partial<EventDraft>) {
    setDraft((current) => (current ? { ...current, ...changes } : current));
  }

  async function addEvent(row: EventDraft) {
    const byUs = teams.some(
      (team) => String(team.id) === row.teamId && team.is_own_team
    );
    const playerName = row.playerName.trim();
    const partnerName = row.partnerName.trim();
    const hasPartner = byUs ? row.partnerId !== '' : partnerName !== '';

    if (!row.teamId || (byUs ? !row.playerId : !playerName)) {
      showErrorToast('Hãy chọn đội và cầu thủ.');
      return;
    }

    if (row.type === 'substitution' && !hasPartner) {
      showErrorToast('Hãy chọn cầu thủ rời sân.');
      return;
    }

    const usesPartner = getPartnerLabel(row.type) != null;

    setIsSaving(true);
    const { error } = await supabase.from('match_events').insert({
      match_id: matchId,
      competition_team_id: Number(row.teamId),
      minute: row.minute === '' ? null : Number(row.minute),
      type: row.type,
      player_user_id: byUs ? row.playerId : null,
      player_name: byUs ? null : playerName,
      assist_user_id: usesPartner && byUs && row.partnerId ? row.partnerId : null,
      assist_name: usesPartner && !byUs ? partnerName || null : null,
      note: usesPartner ? null : row.note.trim() || null,
    });
    setIsSaving(false);

    if (error) {
      showErrorToast('Không thêm được sự kiện.');
      return;
    }

    setDraft(null);
    showSuccessToast('Đã thêm sự kiện');
    router.refresh();
  }

  async function removeEvent(eventId: number) {
    // Selecting the row back is what makes a no-op visible: a delete blocked by
    // row level security removes zero rows and reports no error.
    const { data: removed, error } = await supabase
      .from('match_events')
      .delete()
      .eq('id', eventId)
      .select('id');

    if (error || !removed || removed.length === 0) {
      showErrorToast('Không xoá được sự kiện.');
      return;
    }

    showSuccessToast('Đã xoá sự kiện');
    router.refresh();
  }

  const draftByUs =
    draft != null &&
    teams.some(
      (team) => String(team.id) === draft.teamId && team.is_own_team
    );
  const partnerLabel = draft ? getPartnerLabel(draft.type) : null;

  return (
    <Card className='overflow-hidden'>
      <div className='border-b px-5 py-3.5 text-sm font-semibold'>
        Diễn biến trận đấu
      </div>

      {events.length === 0 ? (
        <p className='px-5 py-4 text-sm text-muted-foreground'>
          Chưa có diễn biến nào được ghi.
        </p>
      ) : (
        events.map((event) => {
          const team = teams.find(
            (item) => item.id === event.competition_team_id
          );
          const detail = getEventDetail(event);

          return (
            <div
              key={event.id}
              className='flex items-center gap-4 border-b px-5 py-3 last:border-b-0'
            >
              <span className='w-10 flex-none text-sm font-semibold text-muted-foreground'>
                {event.minute != null ? `${event.minute}'` : '—'}
              </span>
              <Badge
                variant={event.type === 'goal' ? 'default' : 'secondary'}
                className='flex-none'
              >
                {EVENT_LABELS[event.type as EventType] ?? event.type}
              </Badge>
              <div className='flex-1 min-w-0'>
                <p className='flex items-center gap-1.5 text-sm font-medium truncate'>
                  {event.type === 'goal' ? (
                    <SoccerBall className='h-3.5 w-3.5 flex-none text-muted-foreground' />
                  ) : null}
                  {getEventTitle(event)}
                </p>
                {detail ? (
                  <p className='flex items-center gap-1.5 text-sm text-muted-foreground truncate'>
                    {event.type === 'goal' ? (
                      <Footprints className='h-3.5 w-3.5 flex-none' />
                    ) : null}
                    {detail}
                  </p>
                ) : null}
              </div>
              <span className='flex h-[22px] w-[22px] flex-none items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground'>
                {team ? getTeamAbbr(team.name, team.abbr) : ''}
              </span>
              {canEdit ? (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 flex-none'
                  aria-label='Xoá sự kiện'
                  onClick={() => removeEvent(event.id)}
                >
                  <X className='h-4 w-4' />
                </Button>
              ) : null}
            </div>
          );
        })
      )}

      {canEdit ? (
        <div className='border-t px-5 py-3'>
          {draft ? (
            <div className='space-y-3'>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-[80px_1fr_1fr]'>
                <Input
                  placeholder='Phút'
                  type='number'
                  min='0'
                  value={draft.minute}
                  onChange={(event) =>
                    updateDraft({ minute: event.target.value })
                  }
                />
                <Select
                  value={draft.type}
                  onValueChange={(type) =>
                    updateDraft({
                      type: type as EventType,
                      partnerId: '',
                      partnerName: '',
                      note: '',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {EVENT_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={draft.teamId}
                  onValueChange={(teamId) =>
                    updateDraft({
                      teamId,
                      playerId: '',
                      playerName: '',
                      partnerId: '',
                      partnerName: '',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Đội' />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {draftByUs ? (
                  <PlayerPicker
                    members={members}
                    value={draft.playerId}
                    onChange={(playerId) => updateDraft({ playerId })}
                    placeholder='Tìm cầu thủ theo tên, số áo hoặc vị trí…'
                  />
                ) : (
                  <Input
                    placeholder='Cầu thủ'
                    value={draft.playerName}
                    onChange={(event) =>
                      updateDraft({ playerName: event.target.value })
                    }
                  />
                )}

                {partnerLabel == null ? (
                  <Input
                    placeholder='Ghi chú (nếu có)'
                    value={draft.note}
                    onChange={(event) =>
                      updateDraft({ note: event.target.value })
                    }
                  />
                ) : draftByUs ? (
                  <PlayerPicker
                    members={members}
                    value={draft.partnerId}
                    onChange={(partnerId) => updateDraft({ partnerId })}
                    placeholder={`${partnerLabel} — tìm theo tên, số áo…`}
                    noneLabel={
                      draft.type === 'goal' ? 'Không có kiến tạo' : 'Chưa chọn'
                    }
                  />
                ) : (
                  <Input
                    placeholder={partnerLabel}
                    value={draft.partnerName}
                    onChange={(event) =>
                      updateDraft({ partnerName: event.target.value })
                    }
                  />
                )}
              </div>

              <div className='flex gap-2'>
                <Button
                  type='button'
                  size='sm'
                  disabled={isSaving}
                  onClick={() => addEvent(draft)}
                >
                  Lưu sự kiện
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={() => setDraft(null)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                setDraft(createDraft(ownTeam ? String(ownTeam.id) : ''))
              }
            >
              + Thêm sự kiện
            </Button>
          )}
        </div>
      ) : null}
    </Card>
  );
}
