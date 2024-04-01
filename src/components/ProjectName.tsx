import { Input } from '@/components/ui/input';
import type { Project as ProjectT } from '@/utils/types';
import { useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';

export default function ProjectName({ project }: { project: ProjectT }) {
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(project.name);

  if (!edit) {
    return (
      <div
        ref={textRef}
        onClick={() => {
          const selection = window.getSelection();
          if (selection && selection.type === 'Range') return;

          setEdit(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
        onSelect={(e) => {
          e.preventDefault();
        }}
      >
        {text}
      </div>
    );
  }
  return (
    <>
      <Input
        ref={inputRef}
        onBlur={async () => {
          setEdit(false);
          await supabase
            .from('project')
            .update({
              name: text,
            })
            .eq('id', project.id);
        }}
        value={text}
        type='text'
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </>
  );
}
