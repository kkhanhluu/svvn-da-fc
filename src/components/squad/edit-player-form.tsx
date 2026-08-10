'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../../../database.types';
import {
  getPositionGroup,
  POSITION_OPTIONS,
} from '../../helpers/getPositionLabel';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import { UserProfile } from '../../types';
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
  FormDescription,
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

type EditPlayerFormValues = {
  lastName: string;
  firstName: string;
  shirtNumber: string;
  position: string;
  score: string;
};

function toNullableNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value);
}

export function EditPlayerForm({
  player,
  onDone,
}: {
  player: UserProfile;
  onDone: () => void;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EditPlayerFormValues>({
    defaultValues: {
      lastName: player.last_name ?? '',
      firstName: player.first_name ?? '',
      shirtNumber: player.shirt_number?.toString() ?? '',
      // Existing rows hold free text ('Defender', stray spaces); normalise so
      // the select matches an option, and leave it empty when never set.
      position: player.position ? getPositionGroup(player.position) : '',
      score: player.score?.toString() ?? '',
    },
  });

  async function onSubmit(values: EditPlayerFormValues) {
    setIsSaving(true);
    showLoadingToast('Đang cập nhật cầu thủ...');

    // Selecting the row back is what makes a no-op visible: an update blocked
    // by row level security affects zero rows and reports no error.
    const { data: updated, error } = await supabase
      .from('users')
      .update({
        last_name: values.lastName.trim(),
        first_name: values.firstName.trim(),
        shirt_number: toNullableNumber(values.shirtNumber),
        position: values.position || null,
        score: toNullableNumber(values.score),
      })
      .eq('id', player.id)
      .select('id');

    setIsSaving(false);

    if (error) {
      showErrorToast('Không cập nhật được cầu thủ.');
      return;
    }

    if (!updated || updated.length === 0) {
      showErrorToast(
        'Không có thay đổi nào được lưu — tài khoản của bạn không có quyền sửa cầu thủ này.'
      );
      return;
    }

    showSuccessToast('Cập nhật thành công');
    onDone();
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa cầu thủ</CardTitle>
        <CardDescription>
          Số áo và vị trí được dùng để dựng sơ đồ đội hình. Ảnh đại diện được
          đổi bằng cách di chuột lên ảnh phía trên.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='lastName'
                rules={{ required: 'Hãy nhập họ.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder='Nguyễn' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='firstName'
                rules={{ required: 'Hãy nhập tên.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder='Văn A' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              <FormField
                control={form.control}
                name='shirtNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số áo</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' max='99' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vị trí</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn vị trí' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='score'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm đánh giá</FormLabel>
                    <FormControl>
                      <Input type='number' min='0' {...field} />
                    </FormControl>
                    <FormDescription>Dùng để chia đội.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isSaving}>
                Lưu thay đổi
              </Button>
              <Button type='button' variant='outline' onClick={onDone}>
                Hủy
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
