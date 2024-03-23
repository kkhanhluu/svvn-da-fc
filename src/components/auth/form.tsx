'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { Database } from '../../../database.types';
import { PasswordInput } from '../ui/password-input';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type InputForm = {
  email: string;
  password: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
  } = useForm<InputForm>();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const signIn: SubmitHandler<InputForm> = async ({ email, password }) => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.replace('/events');
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(signIn)}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className='px-1 text-xs text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Password
            </Label>
            <PasswordInput
              id='password'
              placeholder='Mật khẩu của bạn'
              autoCapitalize='none'
              autoCorrect='off'
              disabled={isLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className='px-1 text-xs text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type='submit'
            className={cn(buttonVariants())}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Đăng nhập
          </button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
      </div>
    </div>
  );
}
