import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../../../database.types';
import { Notifications } from '../../../components/notification';

export default async function NotificationPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data } = await supabase.from('notifications').select('*');

  if (!data) {
    return null;
  }

  return <Notifications data={data} />;
}
