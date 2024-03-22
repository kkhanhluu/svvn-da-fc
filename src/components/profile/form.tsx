'use client';

import { useForm } from 'react-hook-form';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Database } from '../../../database.types';
import { UserProfile } from '../../types';
import { Button } from '../ui/button';
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
import { Separator } from '../ui/separator';
import { toast } from '../ui/use-toast';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
};

export function ProfileForm({ user }: { user: UserProfile }) {
  const form = useForm<ProfileFormValues>({
    mode: 'onChange',
    defaultValues: {
      firstName: user.first_name ?? undefined,
      lastName: user.last_name ?? undefined,
    },
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  async function onSubmit(data: ProfileFormValues) {
    toast({
      description: (
        <div className='flex gap-2 items-center'>
          <Loader2 className='animate-spin' />
          <p className='font-bold'>Đang cập nhật...</p>
        </div>
      ),
    });
    const { error } = await supabase
      .from('users')
      .update({ first_name: data.firstName, last_name: data.lastName })
      .eq('id', user.id);

    if (error) {
      toast({
        description: (
          <div className='flex gap-2 items-center'>
            <CircleAlert />
            <p>Đã xảy ra lỗi!</p>
          </div>
        ),
        variant: 'destructive',
      });
    } else {
      toast({
        description: (
          <div className='flex gap-2 items-center'>
            <CircleCheck className='text-green-600' />
            <p className='font-bold'>Cập nhật thành công!</p>
          </div>
        ),
      });
      router.refresh();
    }
  }

  return (
    <div className='space-y-6 min-w-[40vw]'>
      <div>
        <h3 className='text-lg font-medium'>Thông tin cá nhân</h3>
        <p className='text-sm text-muted-foreground'>
          Cập nhật thông tin cá nhân
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder='Văn A' {...field} />
                </FormControl>
                <FormDescription>
                  Nhập tên thật để admin dễ dang sắp xếp lịch thi đấu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ</FormLabel>
                <FormControl>
                  <Input placeholder='Nguyễn' {...field} />
                </FormControl>
                <FormDescription>
                  Nhập họ thật để admin dễ dang sắp xếp lịch thi đấu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Cập nhật</Button>
        </form>
      </Form>
    </div>
  );
}
