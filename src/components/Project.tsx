import type { Project as ProjectT } from '@/utils/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import ProjectName from './ProjectName';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Project({
  project,
  projects,
  setProjects,
}: {
  project: ProjectT;
  projects: ProjectT[];
  setProjects: (projects: ProjectT[]) => void;
}) {
  const [totalTime, setTotalTime] = useState(project.total_time);
  const [time, setTime] = useState(project.total_time);
  const [isRunning, setIsRunning] = useState(project.is_running);
  const [lastTime, setLastTime] = useState(project.last_time || Date.now());
  const [inter, setInter] = useState(null as NodeJS.Timeout | null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isRunning) {
      setInter(
        setInterval(() => {
          setTime(totalTime + (Date.now() - lastTime));
        }, 1000),
      );
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    } else {
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateProject(project: ProjectT) {
    if (isRunning) {
      if (inter) {
        clearInterval(inter);
      }

      setIsRunning(false);
      setTotalTime(time);
      await supabase
        .from('project')
        .update({
          is_running: false,
          total_time: time,
        })
        .eq('id', project.id)
        .select();
    } else {
      const now = Date.now();
      setIsRunning(true);
      setLastTime(now);
      setInter(
        setInterval(() => {
          setTime(totalTime + (Date.now() - now));
        }, 1000),
      );
      await supabase
        .from('project')
        .update({
          is_running: true,
          last_time: lastTime,
        })
        .eq('id', project.id)
        .select();
    }
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <TableRow className={isRunning ? '' : 'opacity-50'}>
      <TableCell className='underline'>
        <ProjectName project={project} />
      </TableCell>
      <TableCell className='font-bold text-lg'>
        {loaded ? formatTime(Math.round(time / 1000)) : '...'}
      </TableCell>
      <TableCell className='text-right w-[90px]'>
        <Button
          onClick={() => {
            updateProject(project);
          }}
          variant={isRunning ? 'destructive' : 'outline'}
          size='sm'
        >
          {isRunning ? 'Stop' : 'Start'}
        </Button>
      </TableCell>
      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size='sm' variant='ghost'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 128 512'
                className='w-4 h-4 fill-current'
              >
                <path d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={async () => {
                const { error } = await supabase
                  .from('project')
                  .delete()
                  .eq('id', project.id);
                if (error) {
                  console.error(error);
                  return;
                }
                setProjects(projects.filter((p) => p.id !== project.id));
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
