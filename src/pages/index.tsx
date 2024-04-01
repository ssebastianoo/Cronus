import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Project as ProjectType } from '@/utils/types';
import Project from '@/components/Project';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  const [projects, setProjects] = useState([] as ProjectType[]);
  const [user, setUser] = useState(null as User | null);

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

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user: user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('project')
          .select()
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (data) {
          setProjects(data);
        }
      }
    }
    checkUser();
  }, []);

  async function createProject() {
    const { data, error } = await supabase
      .from('project')
      .insert([{}])
      .select();
    if (data) {
      setProjects([...projects, ...data]);
    } else {
      console.log(data, error);
    }
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center h-[calc(var(--fh)+56px)]'>
        <Card>
          <CardHeader>
            <CardTitle>Time Tracker</CardTitle>
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

  return (
    <>
      <nav className='flex justify-end h-14 items-center pr-3 '>
        <Button
          size='sm'
          variant='outline'
          className='text-xs'
          onClick={async () => {
            await supabase.auth.signOut();
            location.reload();
          }}
        >
          Logout
        </Button>
      </nav>
      <div className='justify-center flex sm:items-center h-[var(--fh)] items-start'>
        <div className='w-full max-w-xl'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead className='w-[120px]'>Time</TableHead>
                <TableHead className='w-[30px]' />
                <TableHead className='w-[80px] text-right'>
                  <Button onClick={createProject} variant='outline' size={'sm'}>
                    <svg
                      className='w-4 h-4 fill-current'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 448 512'
                    >
                      <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
                    </svg>
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <Project
                  key={project.id}
                  project={project}
                  projects={projects}
                  setProjects={setProjects}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
