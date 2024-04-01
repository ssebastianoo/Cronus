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

export default function Home() {
  const [projects, setProjects] = useState([] as ProjectType[]);
  const user = useStore((state) => state.user);

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
