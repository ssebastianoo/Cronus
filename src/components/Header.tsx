import { buttonVariants } from '@/components/ui/button';
import { supabase } from '@/utils/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';

export default function Header() {
  return (
    <nav className='flex justify-end h-14 items-center pr-3 '>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            <EllipsisVertical size={20} />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className='cursor-pointer'>
            <Link
              href='https://github.com/ssebastianoo/time-tracker'
              target='_blank'
              className='hover:underline'
            >
              GitHub
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={async () => {
              await supabase.auth.signOut();
              location.reload();
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
