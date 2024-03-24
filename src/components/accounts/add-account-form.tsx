'use client';

import { useForm } from 'react-hook-form';

import { CircleCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Training } from '../../types';
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
import { Switch } from '../ui/switch';
import { toast } from '../ui/use-toast';

type AccountFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export function AddAccountForm({ trainings }: { trainings: Training[] }) {
  const limitedTrainings = trainings.filter(
    (training) => training.max_attendees != null
  );
  const unlimitedTrainings = trainings.filter(
    (training) => training.max_attendees == null
  );

  const [registeredTrainings, setRegisteredTrainings] = useState(
    limitedTrainings
      .map((t) => ({ id: t.id, registered: false }))
      .concat(unlimitedTrainings.map((t) => ({ id: t.id, registered: true })))
  );

  const form = useForm<AccountFormValues>();

  async function onSubmit(data: AccountFormValues) {
    toast({
      description: (
        <div className='flex gap-2 items-center'>
          <Loader2 className='animate-spin' />
          <p className='font-bold'>Đang tạo tài khoản mới...</p>
        </div>
      ),
    });

    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        registered_trainings: registeredTrainings,
      }),
    });

    if (response.ok) {
      toast({
        description: (
          <div className='flex gap-2 items-center'>
            <CircleCheck className='text-green-600' />
            <p className='font-bold'>Tạo tài khoản thành công</p>
          </div>
        ),
      });
    } else {
      toast({
        description: 'Có lỗi xảy ra',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ</FormLabel>
                  <FormControl>
                    <Input placeholder='Họ' {...field} />
                  </FormControl>
                  <FormDescription>Họ của nguời dùng.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder='Tên' {...field} />
                  </FormControl>
                  <FormDescription>Tên của nguời dùng</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email' type='email' {...field} />
              </FormControl>
              <FormDescription>Email của nguời dùng</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3 className='mb-4 text-md font-medium'>Các buổi tập sẽ tham gia</h3>
          <div className='space-y-4'>
            {limitedTrainings.map((limitedTraining) => {
              return (
                <FormField
                  key={limitedTraining.id}
                  name='social_emails'
                  render={() => {
                    const trainingIndex = registeredTrainings.findIndex(
                      (training) => training.id === limitedTraining.id
                    );

                    return (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            {limitedTraining.description}
                          </FormLabel>
                          <FormDescription>
                            Người dùng này đã đóng tiền cho buổi tập{' '}
                            {limitedTraining.description}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={
                              registeredTrainings[trainingIndex].registered
                            }
                            onCheckedChange={(checked) => {
                              const updatedRegisteredTrainings = [
                                ...registeredTrainings,
                              ];
                              updatedRegisteredTrainings[
                                trainingIndex
                              ].registered = checked;
                              setRegisteredTrainings(
                                updatedRegisteredTrainings
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              );
            })}
          </div>
        </div>

        <Button type='submit'>Tạo tài khoản</Button>
      </form>
    </Form>
  );
}
