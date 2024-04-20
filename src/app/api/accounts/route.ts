import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

const mailJetClient = Mailjet.apiConnect(
  process.env.NEXT_PUBLIC_MAILJET_KEY as string,
  process.env.NEXT_PUBLIC_MAILJET_SECRET as string
);

const url = 'https://svvn-darmstadt.vercel.app/login';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY as string
);

export async function POST(request: NextRequest) {
  const requestBody = await request.json();

  try {
    // create user
    const firstName = requestBody.first_name;
    const email = requestBody.email;
    const password = generateStrongPassword();
    const {
      data: { user },
      error: createUserError,
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (!user || createUserError != null) {
      return new NextResponse('Cannot create user', { status: 500 });
    }

    // update user profile
    await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: requestBody.last_name,
        temp_password: password,
      })
      .eq('id', user.id);

    // insert trainings for user
    const registeredTrainings = requestBody.registered_trainings
      .filter((training: any) => training.registered)
      .map((training: any) => training.id);

    if (registeredTrainings.length > 0) {
      await supabase.from('trainings_users').insert(
        registeredTrainings.map((trainingId: string) => ({
          user_id: user.id,
          training_id: trainingId,
        }))
      );
    }

    // send email to user
    await mailJetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'svvndarmstadtfc@gmail.com',
            Name: 'CLB bóng đá svvn Darmstadt',
          },
          To: [
            {
              Email: email,
              Name: firstName,
            },
          ],
          Subject: 'Thông tin đăng ký đá bóng',
          TextPart: 'Thông tin đăng ký đá bóng',
          HTMLPart: `<h3>Xin chào ${firstName},</h3>
              <br />
              <p>
              Chào mừng bạn tham gia CLB bóng đá Darmstadt. Để đăng ký đá bóng mỗi tuần, vui lòng sử dụng đường link sau: <a href="${url}">${url}</a>
              </p>
              <br />
              <h4>Thông tin đăng nhập</h4>
              <ul>
              <li><b>Email</b>: ${email}</li>
              <li><b>Password</b>: ${password}</li>
              </ul>
             `,
          CustomID: 'AppGettingStartedTest',
        },
      ],
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Something went wrong', {
      status: 500,
    });
  }

  return NextResponse.json({ message: 'Create user successfully' });
}

function generateStrongPassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_+=';

  const allCharacters = lowercase + uppercase + numbers + symbols;

  let password = '';

  // Generate a random index to select characters from the pool
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  // Generate a strong password
  for (let i = 0; i < length; i++) {
    const randomIndex = getRandomInt(allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}
