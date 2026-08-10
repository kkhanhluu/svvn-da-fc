'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Star, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../../../database.types';
import { getTeamAbbr } from '../../helpers/playerName';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
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

const MINIMUM_TEAMS = 2;

interface DraftTeam {
  name: string;
  isOwnTeam: boolean;
}

type CompetitionFormValues = {
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  venue: string;
  organizer: string;
  legs: string;
};

export function CreateCompetitionForm({ onCreated }: { onCreated: () => void }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [teams, setTeams] = useState<DraftTeam[]>([]);
  const [teamInput, setTeamInput] = useState('');
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CompetitionFormValues>({
    defaultValues: {
      name: '',
      season: String(new Date().getFullYear()),
      startDate: '',
      endDate: '',
      venue: '',
      organizer: '',
      legs: '1',
    },
  });

  function addTeam() {
    const name = teamInput.trim();
    if (!name) {
      return;
    }

    const alreadyAdded = teams.some(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyAdded) {
      setTeamsError('Đội này đã có trong danh sách.');
      return;
    }

    // The first team entered is almost always ours, so pre-select it.
    setTeams([...teams, { name, isOwnTeam: teams.length === 0 }]);
    setTeamInput('');
    setTeamsError(null);
  }

  function handleTeamInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTeam();
    }
  }

  function markAsOwnTeam(index: number) {
    setTeams(teams.map((team, i) => ({ ...team, isOwnTeam: i === index })));
  }

  function removeTeam(index: number) {
    setTeams(teams.filter((_, i) => i !== index));
  }

  async function onSubmit(values: CompetitionFormValues) {
    if (teams.length < MINIMUM_TEAMS) {
      setTeamsError(`Cần ít nhất ${MINIMUM_TEAMS} đội tham gia.`);
      return;
    }
    if (!teams.some((team) => team.isOwnTeam)) {
      setTeamsError('Hãy chọn đội của CLB bằng cách chạm vào tên đội.');
      return;
    }

    setIsSaving(true);
    showLoadingToast('Đang tạo giải đấu...');

    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .insert({
        name: values.name.trim(),
        season: values.season.trim() || null,
        legs: Number(values.legs),
        team_count: teams.length,
        start_date: values.startDate || null,
        end_date: values.endDate || null,
        venue: values.venue.trim() || null,
        organizer: values.organizer.trim() || null,
      })
      .select('id')
      .single();

    if (competitionError || !competition) {
      setIsSaving(false);
      showErrorToast('Không tạo được giải đấu.');
      return;
    }

    const { error: teamsInsertError } = await supabase
      .from('competition_teams')
      .insert(
        teams.map((team) => ({
          competition_id: competition.id,
          name: team.name,
          abbr: getTeamAbbr(team.name),
          is_own_team: team.isOwnTeam,
        }))
      );

    setIsSaving(false);

    if (teamsInsertError) {
      showErrorToast('Đã tạo giải đấu nhưng không thêm được các đội.');
      return;
    }

    showSuccessToast('Tạo giải đấu thành công');
    form.reset();
    setTeams([]);
    onCreated();
    router.refresh();
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Tạo giải đấu mới</CardTitle>
        <CardDescription>
          Thể thức vòng tròn — bảng xếp hạng sẽ tự động tính từ kết quả các
          trận.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <FormField
                control={form.control}
                name='name'
                rules={{ required: 'Hãy nhập tên giải đấu.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên giải đấu</FormLabel>
                    <FormControl>
                      <Input placeholder='VD: Giải Nội Bộ SVVN 2026' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='season'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mùa giải</FormLabel>
                    <FormControl>
                      <Input placeholder='2026' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='venue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sân đấu</FormLabel>
                    <FormControl>
                      <Input placeholder='VD: Sportplatz Wiesbaden' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='legs'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượt</FormLabel>
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
                        <SelectItem value='1'>Một lượt</SelectItem>
                        <SelectItem value='2'>
                          Hai lượt (sân nhà / sân khách)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <p className='text-sm font-medium mb-2'>Các đội tham gia</p>
              <div className='flex flex-wrap items-center gap-2'>
                {teams.map((team, index) => (
                  <span
                    key={team.name}
                    className={cn(
                      'inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium',
                      team.isOwnTeam
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <button
                      type='button'
                      className='inline-flex items-center gap-1'
                      onClick={() => markAsOwnTeam(index)}
                      title='Đánh dấu là đội của CLB'
                    >
                      {team.isOwnTeam ? <Star className='h-3 w-3' /> : null}
                      {team.name}
                    </button>
                    <button
                      type='button'
                      onClick={() => removeTeam(index)}
                      aria-label={`Xoá ${team.name}`}
                    >
                      <X className='h-3 w-3 opacity-70' />
                    </button>
                  </span>
                ))}
                <Input
                  className='h-8 w-40'
                  placeholder='+ Thêm đội'
                  value={teamInput}
                  onChange={(event) => setTeamInput(event.target.value)}
                  onKeyDown={handleTeamInputKeyDown}
                  onBlur={addTeam}
                />
              </div>
              <p className='text-sm text-muted-foreground mt-2'>
                Nhấn Enter để thêm đội. Chạm vào tên đội để đánh dấu đội của
                CLB.
              </p>
              {teamsError ? (
                <p className='text-sm font-medium text-destructive mt-1'>
                  {teamsError}
                </p>
              ) : null}
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isSaving}>
                Tạo giải đấu
              </Button>
              <Button type='button' variant='outline' onClick={onCreated}>
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
