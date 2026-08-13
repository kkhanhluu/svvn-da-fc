'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Database } from '../../../../database.types';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../../helpers/showNotifications';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';

type CreateEventFormValues = {
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees: string;
};

export function CreateEventForm({ onCreated }: { onCreated: () => void }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CreateEventFormValues>({
    defaultValues: {
      description: '',
      date: '',
      startTime: '19:00',
      endTime: '21:00',
      location: '',
      maxAttendees: '',
    },
  });

  async function onSubmit(values: CreateEventFormValues) {
    if (values.endTime <= values.startTime) {
      form.setError('endTime', {
        message: 'Giờ kết thúc phải sau giờ bắt đầu.',
      });
      return;
    }

    setIsSaving(true);
    showLoadingToast('Đang tạo buổi đá bóng...');

    const { error } = await supabase.from('irregular_events').insert({
      description: values.description.trim(),
      date: values.date,
      start_time: values.startTime,
      end_time: values.endTime,
      location: values.location.trim() || null,
      max_attendees:
        values.maxAttendees === '' ? null : Number(values.maxAttendees),
    });

    setIsSaving(false);

    if (error) {
      showErrorToast('Không tạo được buổi đá bóng.');
      return;
    }

    showSuccessToast('Tạo buổi đá bóng thành công');
    form.reset();
    onCreated();
    router.refresh();
  }

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Tạo buổi đá bóng mới</CardTitle>
        <CardDescription>
          Buổi đá bóng ngoài lịch tập thường lệ — thành viên có thể đăng ký
          tham gia ngay sau khi tạo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <FormField
                control={form.control}
                name='description'
                rules={{ required: 'Hãy nhập tên buổi đá bóng.' }}
                render={({ field }) => (
                  <FormItem className='sm:col-span-2 lg:col-span-3'>
                    <FormLabel>Tên buổi đá bóng</FormLabel>
                    <FormControl>
                      <Input placeholder='VD: Giao hữu cuối tuần' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='date'
                rules={{ required: 'Hãy chọn ngày diễn ra.' }}
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
                name='startTime'
                rules={{ required: 'Hãy chọn giờ bắt đầu.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ bắt đầu</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                rules={{ required: 'Hãy chọn giờ kết thúc.' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ kết thúc</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input placeholder='VD: Sportplatz Wiesbaden' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxAttendees'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        placeholder='Không giới hạn'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex gap-2'>
              <Button type='submit' disabled={isSaving}>
                Tạo buổi đá bóng
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
