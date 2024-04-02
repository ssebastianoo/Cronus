import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase';

export default function Login() {
  function signIn() {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : undefined,
      },
    });
  }

  return (
    <div className='flex justify-center items-center h-[calc(var(--fh))]'>
      <Card>
        <CardHeader>
          <CardTitle>Cronus</CardTitle>
          <CardDescription>
            Track how much time you spend on your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='text-md' onClick={signIn}>
            Login
          </Button>
        </CardContent>
        <CardFooter>
          <Link
            href='https://github.com/ssebastianoo/time-tracker'
            className='hover:underline'
          >
            GitHub
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
