'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../../../database.types';
import { getFullName, searchMembers } from '../../helpers/playerName';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import { cn } from '../../lib/utils';
import { CompetitionTeam, UserProfile } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface GoalRow {
  id: number;
  minute: string;
  teamId: string;
  scorerId: string;
  scorerName: string;
  assistId: string;
  assistName: string;
}

type MatchFormValues = {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: string;
  awayScore: string;
  matchDate: string;
  kickoffTime: string;
  round: string;
  venue: string;
  referee: string;
  status: string;
};

const NO_ASSIST = 'none';

function createGoalRow(): GoalRow {
  return {
    id: Date.now() + Math.random(),
    minute: '',
    teamId: '',
    scorerId: '',
    scorerName: '',
    assistId: NO_ASSIST,
    assistName: '',
  };
}

export function MatchForm({
  competitionId,
  teams,
  members,
  defaultVenue,
}: {
  competitionId: number;
  teams: CompetitionTeam[];
  members: UserProfile[];
  defaultVenue: string | null;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const ownTeam = teams.find((team) => team.is_own_team);

  const [goalRows, setGoalRows] = useState<GoalRow[]>([createGoalRow()]);
  const [pickedMemberIds, setPickedMemberIds] = useState<string[]>([]);
  const [playerQuery, setPlayerQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MatchFormValues>({
    defaultValues: {
      homeTeamId: ownTeam ? String(ownTeam.id) : '',
      awayTeamId: '',
      homeScore: '0',
      awayScore: '0',
      matchDate: '',
      kickoffTime: '09:00',
      round: '',
      venue: defaultVenue ?? '',
      referee: '',
      status: 'finished',
    },
  });

  const filteredMembers = useMemo(
    () => searchMembers(members, playerQuery),
    [members, playerQuery]
  );

  function updateGoalRow(id: number, changes: Partial<GoalRow>) {
    setGoalRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...changes } : row))
    );
  }

  function toggleMember(memberId: string) {
    setPickedMemberIds((picked) =>
      picked.includes(memberId)
        ? picked.filter((id) => id !== memberId)
        : [...picked, memberId]
    );
  }

  function isOwnTeamSelected(teamId: string): boolean {
    return teams.some(
      (team) => String(team.id) === teamId && team.is_own_team
    );
  }

  async function onSubmit(values: MatchFormValues) {
    if (values.homeTeamId === values.awayTeamId) {
      form.setError('awayTeamId', {
        message: 'Đội khách phải khác đội nhà.',
      });
      return;
    }

    setIsSaving(true);
    showLoadingToast('Đang lưu trận đấu...');

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        competition_id: competitionId,
        home_team_id: Number(values.homeTeamId),
        away_team_id: Number(values.awayTeamId),
        home_score: values.homeScore === '' ? null : Number(values.homeScore),
        away_score: values.awayScore === '' ? null : Number(values.awayScore),
        match_date: values.matchDate,
        kickoff_time: values.kickoffTime || null,
        round: values.round === '' ? null : Number(values.round),
        venue: values.venue.trim() || null,
        referee: values.referee.trim() || null,
        status: values.status,
      })
      .select('id')
      .single();

    if (matchError || !match) {
      setIsSaving(false);
      showErrorToast('Không lưu được trận đấu.');
      return;
    }

    const goals = goalRows
      .filter((row) => row.teamId && (row.scorerId || row.scorerName.trim()))
      .map((row) => {
        const scoredByUs = isOwnTeamSelected(row.teamId);
        const hasAssist =
          row.assistId !== NO_ASSIST || row.assistName.trim() !== '';

        return {
          match_id: match.id,
          competition_team_id: Number(row.teamId),
          minute: row.minute === '' ? null : Number(row.minute),
          type: 'goal',
          player_user_id: scoredByUs ? row.scorerId : null,
          player_name: scoredByUs ? null : row.scorerName.trim(),
          assist_user_id:
            scoredByUs && row.assistId !== NO_ASSIST ? row.assistId : null,
          assist_name:
            !scoredByUs && hasAssist ? row.assistName.trim() : null,
        };
      });

    if (goals.length > 0) {
      const { error: goalsError } = await supabase
        .from('match_events')
        .insert(goals);

      if (goalsError) {
        setIsSaving(false);
        showErrorToast('Đã lưu trận đấu nhưng không lưu được bàn thắng.');
        return;
      }
    }

    if (ownTeam && pickedMemberIds.length > 0) {
      const lineup = pickedMemberIds.map((memberId) => ({
        match_id: match.id,
        competition_team_id: ownTeam.id,
        user_id: memberId,
        is_starter: true,
      }));

      const { error: lineupError } = await supabase
        .from('match_lineups')
        .insert(lineup);

      if (lineupError) {
        setIsSaving(false);
        showErrorToast('Đã lưu trận đấu nhưng không lưu được đội hình.');
        return;
      }
    }

    setIsSaving(false);
    showSuccessToast('Lưu trận đấu thành công');
    router.push(`/competitions/${competitionId}/matches/${match.id}`);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 max-w-3xl'
      >
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Hai đội &amp; tỉ số</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end'>
              <FormField
                control={form.control}
                name='homeTeamId'
                rules={{ required: 'Hãy chọn đội nhà.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đội nhà</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn đội' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={String(team.id)}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-end gap-2 pb-0.5'>
                <FormField
                  control={form.control}
                  name='homeScore'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          className='w-14 text-center'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className='pb-2 text-muted-foreground'>–</span>
                <FormField
                  control={form.control}
                  name='awayScore'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          className='w-14 text-center'
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='awayTeamId'
                rules={{ required: 'Hãy chọn đội khách.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đội khách</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn đội' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={String(team.id)}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Thời gian &amp; địa điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <FormField
                control={form.control}
                name='matchDate'
                rules={{ required: 'Hãy chọn ngày thi đấu.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='kickoffTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='round'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vòng</FormLabel>
                    <FormControl>
                      <Input type='number' min='1' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='venue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sân</FormLabel>
                    <FormControl>
                      <Input placeholder='Sportplatz…' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='referee'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trọng tài</FormLabel>
                    <FormControl>
                      <Input placeholder='Không bắt buộc' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='finished'>
                          Đã kết thúc (FT)
                        </SelectItem>
                        <SelectItem value='scheduled'>Chưa diễn ra</SelectItem>
                        <SelectItem value='live'>Đang diễn ra</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex-row items-center justify-between space-y-0'>
            <div>
              <CardTitle className='text-sm'>Bàn thắng &amp; kiến tạo</CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Mỗi dòng là một bàn thắng.
              </p>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => setGoalRows([...goalRows, createGoalRow()])}
            >
              + Thêm bàn thắng
            </Button>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            {goalRows.map((row) => {
              const scoredByUs = isOwnTeamSelected(row.teamId);

              return (
                <div
                  key={row.id}
                  className='grid grid-cols-2 lg:grid-cols-[72px_1fr_1fr_1fr_32px] gap-2 items-center'
                >
                  <Input
                    placeholder='Phút'
                    type='number'
                    min='0'
                    value={row.minute}
                    onChange={(event) =>
                      updateGoalRow(row.id, { minute: event.target.value })
                    }
                  />
                  <Select
                    value={row.teamId}
                    onValueChange={(teamId) =>
                      updateGoalRow(row.id, {
                        teamId,
                        scorerId: '',
                        scorerName: '',
                        assistId: NO_ASSIST,
                        assistName: '',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Đội ghi bàn' />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {scoredByUs ? (
                    <Select
                      value={row.scorerId}
                      onValueChange={(scorerId) =>
                        updateGoalRow(row.id, { scorerId })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Người ghi bàn' />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {getFullName(member)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder='Người ghi bàn'
                      value={row.scorerName}
                      onChange={(event) =>
                        updateGoalRow(row.id, { scorerName: event.target.value })
                      }
                    />
                  )}

                  {scoredByUs ? (
                    <Select
                      value={row.assistId}
                      onValueChange={(assistId) =>
                        updateGoalRow(row.id, { assistId })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Kiến tạo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NO_ASSIST}>
                          Không có kiến tạo
                        </SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {getFullName(member)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder='Kiến tạo (nếu có)'
                      value={row.assistName}
                      onChange={(event) =>
                        updateGoalRow(row.id, { assistName: event.target.value })
                      }
                    />
                  )}

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    aria-label='Xoá bàn thắng'
                    onClick={() =>
                      setGoalRows(goalRows.filter((item) => item.id !== row.id))
                    }
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {ownTeam ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>Đội hình ra sân</CardTitle>
              <p className='text-sm text-muted-foreground'>
                Chọn cầu thủ đá chính của {ownTeam.name} — dùng để hiển thị sơ
                đồ và tính số trận.
              </p>
            </CardHeader>
            <CardContent>
              <div className='relative mb-4'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  className='pl-9'
                  placeholder='Tìm cầu thủ theo tên, số áo hoặc vị trí…'
                  value={playerQuery}
                  onChange={(event) => setPlayerQuery(event.target.value)}
                />
              </div>
              <div className='flex flex-wrap gap-2 max-h-56 overflow-y-auto'>
                {filteredMembers.map((member) => {
                  const isPicked = pickedMemberIds.includes(member.id);

                  return (
                    <button
                      key={member.id}
                      type='button'
                      onClick={() => toggleMember(member.id)}
                      className={cn(
                        'inline-flex h-9 items-center gap-2 rounded-md border px-3.5 text-sm font-medium transition-colors',
                        isPicked
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span className='text-xs opacity-70'>
                        {member.shirt_number ?? '–'}
                      </span>
                      {getFullName(member)}
                    </button>
                  );
                })}
              </div>
              {filteredMembers.length === 0 ? (
                <p className='text-sm text-muted-foreground py-2'>
                  Không tìm thấy cầu thủ nào.
                </p>
              ) : null}
              <p className='text-sm text-muted-foreground mt-4'>
                Đã chọn {pickedMemberIds.length} cầu thủ · Tổng {members.length}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <div className='flex gap-2'>
          <Button type='submit' disabled={isSaving}>
            Lưu trận đấu
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push(`/competitions/${competitionId}`)}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  );
}
