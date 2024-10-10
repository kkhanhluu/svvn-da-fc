import { UpdatePasswordForm } from '../../../components/auth/update-password-form';

export default async function SettingsPage() {
  return (
    <div className='overflow-y-scroll flex-col space-y-8 p-8 md:p-16 md:mt-10 md:flex'>
      <UpdatePasswordForm />
    </div>
  );
}
