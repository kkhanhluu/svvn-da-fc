'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { Database } from '../../../database.types';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type InputForm = {
  email: string;
  password: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<InputForm>();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const signIn: SubmitHandler<InputForm> = async ({ email, password }) => {
    showLoadingToast('Đang đăng nhập...');
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      showErrorToast(error.message);
    } else {
      router.replace('/events');
      showSuccessToast('Chào mừng bạn quay trở lại');
    }
  };

  return (
    <div className={cn('grid gap-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(signIn)} className='grid gap-2'>
          <FormField
            control={form.control}
            name='email'
            rules={{
              required: 'Email của bạn',
            }}
            render={({ field }) => (
              <FormItem className='grid gap-1'>
                <FormControl>
                  <Input placeholder='Email cuả bạn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              <FormItem className='grid gap-1'>
                <FormControl>
                  <PasswordInput placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className={cn(buttonVariants())}
            disabled={form.formState.isLoading}
          >
            {form.formState.isLoading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
      </div>
    </div>
  );
}
