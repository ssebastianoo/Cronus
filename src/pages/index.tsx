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

export default function Test() {
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
      },
    });
  }

  let intervals: {
    id: number;
    interval: NodeJS.Timeout;
  }[] = [];

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

  async function updateProject(project: ProjectType) {
    let result: { data: ProjectType[] | null; error: any };

    if (project.is_running && project.last_time) {
      const interval = intervals.find((i) => i.id === project.id);
      if (interval) {
        clearInterval(interval.interval);
        intervals = intervals.filter((i) => i.id !== project.id);
      }

      result = await supabase
        .from('project')
        .update({
          is_running: false,
          total_time: Date.now() - project.last_time,
        })
        .eq('id', project.id)
        .select();
    } else {
      result = await supabase
        .from('project')
        .update({
          is_running: true,
          last_time: Date.now(),
        })
        .eq('id', project.id)
        .select();
    }

    console.log(result);

    setProjects(
      projects.map((p) => {
        if (p.id === project.id && result.data) {
          p = result.data[0];
        }
        return p;
      }),
    );

    if (project.is_running) {
      const interval = setInterval(() => {
        setProjects(
          projects.map((p) => {
            if (p.id === project.id && project.last_time) {
              p.total_time = Date.now() - project.last_time;
            }
            return p;
          }),
        );
      }, 1000);
      intervals.push({
        id: project.id,
        interval,
      });
    }
  }

  if (!user) {
    return (
      <div>
        <button onClick={signIn}>signin</button>
      </div>
    );
  }

  return (
    <div className='justify-center flex items-center h-[var(--fh)]'>
      <div className='w-full max-w-xl'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className='w-[100px]'>Time</TableHead>
              <TableHead className='w-[100px] text-right'>
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
  );
}
