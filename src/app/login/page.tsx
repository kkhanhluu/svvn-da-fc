import { Metadata } from 'next';
import Link from 'next/link';

import { UserAuthForm } from '../../components/auth/form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className='container flex flex-col items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Xin chào</h1>
          <p className='text-sm text-muted-foreground'>
            Hãy nhập email và mật khẩu để đăng nhập
          </p>
        </div>
        <UserAuthForm />
        <div className='px-8 flex flex-col gap-4 text-center text-sm text-muted-foreground'>
          <div>
            Quên mật khẩu?
            <Link
              href='/reset-password'
              className='hover:text-brand ml-1 underline underline-offset-4'
            >
              Hãy nhấn vào đây
            </Link>
          </div>
          <div>
            Chưa có tài khoản?
            <Link
              href='/register'
              className='ml-1 hover:text-brand underline underline-offset-4'
            >
              Hãy liên hệ với admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
