'use client';

import { useForm } from 'react-hook-form';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { Database } from '../../../database.types';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../../helpers/showNotifications';
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

type UpdateAccountFormValues = {
  firstName: string;
  lastName: string;
};

export function UpdateAccountForm({
  user,
  allTrainings,
}: {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    trainings_users: { training_id: number }[];
  };
  allTrainings: { id: number; description: string | null }[];
}) {
  const userRegisteredTrainings = user.trainings_users.map(
    ({ training_id }) => training_id
  );
  const [registeredTrainings, setRegisteredTrainings] = useState(
    allTrainings.map((training) => ({
      id: training.id,
      registered: userRegisteredTrainings.includes(training.id),
      description: training.description,
    }))
  );

  const supabase = createClientComponentClient<Database>();

  const form = useForm<UpdateAccountFormValues>({
    defaultValues: {
      firstName: user.first_name ?? '',
      lastName: user.last_name ?? '',
    },
  });

  async function onSubmit(data: UpdateAccountFormValues) {
    showLoadingToast('Đang tạo tài khoản mới...');

    // update first name last name
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ first_name: data.firstName, last_name: data.lastName })
      .eq('id', user.id);

    // update user's trainings
    const newRegisteredTrainings = registeredTrainings
      .filter(
        (training) =>
          training.registered && !userRegisteredTrainings.includes(training.id)
      )
      .map(({ id }) => ({
        training_id: id,
        user_id: user.id,
      }));
    const { error: insertUserTrainingError } = await supabase
      .from('trainings_users')
      .insert(newRegisteredTrainings);

    if (updateUserError || insertUserTrainingError) {
      showErrorToast();
    } else {
      showSuccessToast('Cập nhật thành công');
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

        <div>
          <h3 className='mb-4 text-md font-medium'>Các buổi tập sẽ tham gia</h3>
          <div className='space-y-4'>
            {registeredTrainings.map((training, index) => {
              return (
                <FormField
                  key={training.id}
                  name='trainings'
                  render={() => {
                    return (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            {training.description}
                          </FormLabel>
                          <FormDescription>
                            Người dùng này đã đóng tiền cho buổi tập{' '}
                            {training.description}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={training.registered}
                            disabled={userRegisteredTrainings.includes(
                              training.id
                            )}
                            onCheckedChange={(checked) => {
                              const updatedRegisteredTrainings = [
                                ...registeredTrainings,
                              ];
                              updatedRegisteredTrainings[index].registered =
                                checked;
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

        <Button type='submit'>Cập nhật</Button>
      </form>
    </Form>
  );
}
