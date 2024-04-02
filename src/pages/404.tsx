import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='w-full flex justify-center flex-col h-[var(--fh)] items-center gap-5'>
      <h1 className='text-5xl'>404</h1>
      <Link href='/' className={buttonVariants({ variant: 'default' })}>
        Go back home
      </Link>
    </div>
  );
}
