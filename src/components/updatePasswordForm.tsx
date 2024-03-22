'use client';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Database } from '../../database.types';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';

type ProfileFormValues = {
  password: string;
  confirmPassword: string;
};

export function UpdatePasswordForm() {
  const form = useForm<ProfileFormValues>({
    mode: 'onChange',
  });

  const supabase = createClientComponentClient<Database>();

  async function onSubmit(data: ProfileFormValues) {
    toast({
      description: (
        <div className='flex gap-2 items-center'>
          <Loader2 className='animate-spin' />
          <p className='font-bold'>Đang cập nhật...</p>
        </div>
      ),
    });
    // const { error } = await supabase
    //   .from('users')
    //   .update({ first_name: data.firstName, last_name: data.lastName })
    //   .eq('id', user.id);

    if (1) {
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
    }
  }

  return (
    <div className='space-y-6 min-w-[40vw]'>
      <div>
        <h3 className='text-lg font-medium'>Mật khẩu</h3>
        <p className='text-sm text-muted-foreground'>Thay đổi mật khẩu</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder='Password' {...field} />
                </FormControl>
                <FormDescription>Nhập mật khẩu mới của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder='Confirm password' {...field} />
                </FormControl>
                <FormDescription>Xác nhận mật khẩu mới của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Thay đổi mật khẩu</Button>
        </form>
      </Form>
    </div>
  );
}
