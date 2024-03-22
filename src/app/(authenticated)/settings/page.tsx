import { UpdatePasswordForm } from '../../../components/updatePasswordForm';

export default async function SettingsPage() {
  return (
    <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <UpdatePasswordForm />
    </div>
  );
}
