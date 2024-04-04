import { useState, useRef } from 'react';
import { Input } from './ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/utils/supabase';
import type { Project as ProjectT } from '@/utils/types';

export default function Timer({
  time,
  setTime,
  totalTime,
  setTotalTime,
  setLastTime,
  project,
  inter,
  setInter,
  isRunning,
}: {
  time: number;
  setTime: (time: number) => void;
  totalTime: number;
  setTotalTime: (time: number) => void;
  setLastTime: (time: number) => void;
  project: ProjectT;
  inter: NodeJS.Timeout | null;
  setInter: (inter: NodeJS.Timeout | null) => void;
  isRunning: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  function timeToSeconds(timeString: string): number {
    const trimmedTimeString = timeString.trim();
    const [hours, minutes, seconds] = trimmedTimeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error('Invalid time format');
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
  }

  async function setNewTimer() {
    if (inputRef.current) {
      let time: number;
      try {
        time = timeToSeconds(inputRef.current.value);
      } catch (error) {
        toast({
          title: 'Invalid time format',
          description: 'Please enter a valid time format',
          variant: 'destructive',
        });
        return;
      }
      time = time * 1000;
      const now = Date.now();

      setTotalTime(time);
      setLastTime(now);
      setEditing(false);
      setTime(time);

      if (isRunning) {
        if (inter) {
          clearInterval(inter);
        }

        setInter(
          setInterval(() => {
            setTime(time + (Date.now() - now));
          }, 1000),
        );
      }

      await supabase
        .from('project')
        .update({ total_time: time, last_time: now })
        .eq('id', project.id);
    }
  }

  return (
    <>
      {editing ? (
        <div className='w-full h-[var(--fh)] flex justify-center items-center fixed bottom-0 left-0 z-50 backdrop-blur-sm'>
          {' '}
          <Input
            ref={inputRef}
            className='w-32 text-xl h-14 text-center'
            placeholder='00:00:00'
            onBlur={() => {
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setNewTimer();
              } else if (e.key === 'Escape') {
                setEditing(false);
              }
            }}
          />
        </div>
      ) : null}
      <p
        onClick={() => {
          setEditing(true);

          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
      >
        {formatTime(Math.round(time / 1000))}
      </p>
    </>
  );
}
