import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
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
import { useStore } from '@/utils/store';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [projects, setProjects] = useState([] as ProjectType[]);
  const user = useStore((state) => state.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function checkUser() {
      if (user) {
        const { data, error } = await supabase
          .from('project')
          .select()
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (data) {
          setProjects(data);
        }
        setLoaded(true);
      }
    }
    checkUser();
  }, [user]);

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

  if (!loaded) {
    return (
      <div className='w-full flex flex-col gap-4 justify-center items-center h-[var(--fh)]'>
        <div className='flex flex-col gap-1  w-72'>
          <Skeleton className='w-40 h-6' />
          <Skeleton className='w-44 h-6' />
        </div>
        <div className='flex flex-col gap-1 w-72'>
          <Skeleton className='w-32 h-6' />
          <Skeleton className='w-52 h-6' />
        </div>
        <div className='flex flex-col gap-1 w-72'>
          <Skeleton className='w-36 h-6' />
          <Skeleton className='w-48 h-6' />
        </div>
        <div className='flex flex-col gap-1 w-72'>
          <Skeleton className='w-28 h-6' />
          <Skeleton className='w-40 h-6' />
        </div>
      </div>
    );
  }

  return (
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
                  <Plus size={20} />
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
