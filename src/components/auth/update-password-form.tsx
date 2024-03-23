'use client';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Database } from '../../../database.types';
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
import { PasswordInput } from '../ui/password-input';
import { toast } from '../ui/use-toast';

type UpdatePasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export function UpdatePasswordForm() {
  const form = useForm<UpdatePasswordFormValues>({
    mode: 'onChange',
  });

  const supabase = createClientComponentClient<Database>();

  async function onSubmit(data: UpdatePasswordFormValues) {
    toast({
      description: (
        <div className='flex gap-2 items-center'>
          <Loader2 className='animate-spin' />
          <p className='font-bold'>Đang cập nhật...</p>
        </div>
      ),
    });
    const {
      error,
      data: { user },
    } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (user) {
      await supabase
        .from('users')
        .update({
          temp_password: null,
        })
        .eq('id', user.id);
    }

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
            rules={{
              required: 'Xin hãy nhập mật khẩu',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Password' {...field} />
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
                  <PasswordInput placeholder='Confirm password' {...field} />
                </FormControl>
                <FormDescription>Xác nhận mật khẩu mới của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              required: 'Xin hãy nhập mật khẩu mới để xác nhận',
              validate: (value) =>
                value === form.watch('password') ||
                'Mật khẩu xác nhận không khớp',
            }}
          />

          <Button type='submit'>Thay đổi mật khẩu</Button>
        </form>
      </Form>
    </div>
  );
}
