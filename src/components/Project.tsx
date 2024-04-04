import type { Project as ProjectT } from '@/utils/types';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Button, buttonVariants } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import ProjectName from './ProjectName';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Timer from './Timer';

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
          last_time: now,
        })
        .eq('id', project.id)
        .select();
    }
  }

  async function resetProject() {
    await supabase
      .from('project')
      .update({ total_time: 0, is_running: false })
      .eq('id', project.id);
    if (inter) {
      clearInterval(inter);
    }
    setTotalTime(0);
    setTime(0);
    setIsRunning(false);
  }

  return (
    <TableRow className={isRunning ? '' : 'text-[#c4c3be]'}>
      <TableCell className='underline max-w-[100px] overflow-auto'>
        <ProjectName project={project} />
      </TableCell>
      <TableCell className='font-bold text-lg'>
        {loaded ? (
          <Timer
            time={time}
            setTime={setTime}
            totalTime={totalTime}
            setTotalTime={setTotalTime}
            project={project}
            setLastTime={setLastTime}
            inter={inter}
            setInter={setInter}
            isRunning={isRunning}
          />
        ) : (
          <>
            <Skeleton className='w-10 h-3 rounded' />
            <Skeleton className='w-8 h-3 rounded mt-1' />
          </>
        )}
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
            <span className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <EllipsisVertical size={20} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className='cursor-pointer' onClick={resetProject}>
              Reset
            </DropdownMenuItem>
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
