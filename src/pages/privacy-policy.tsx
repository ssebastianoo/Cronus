import Link from 'next/link';
import { CornerDownLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className='flex justify-center'>
      <div className='w-10/12 max-w-96 flex flex-col gap-6 mb-7'>
        <Link
          href='/'
          className='hover:underline opacity-55 flex gap-1 items-center'
        >
          <CornerDownLeft size={18} /> Go back home
        </Link>
        <p className='font-bold'>Privacy Policy for Cronus</p>
        <p>
          This Privacy Policy describes how Cronus (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your
          information when you use our website located at {''}
          <Link href='https://cronus.lol' className='underline'>
            https://cronus.lol
          </Link>{' '}
          {''}
          (&quot;Website&quot;). By accessing or using the Website, you agree to
          the terms of this Privacy Policy.
        </p>
        <p className='font-bold'>How We Use Your Information</p>
        <p>
          We use your email address solely for authentication purposes, to
          verify your identity and provide access to our services. We do not use
          your email address for any other purpose, such as marketing or
          communication.
        </p>
        <p className='font-bold'>Data Storage</p>
        <p>
          Your email address and website data are stored securely on a database
          service provided by Supabase. Supabase is committed to maintaining the
          security and confidentiality of your information.
        </p>
        <p className='font-bold'>Third-Party Services</p>
        <p>
          We use Google OAuth for authentication purposes. When you log in using
          Google OAuth, Google may collect certain information in accordance
          with its own privacy policies. We do not control or have access to the
          information collected by Google.
        </p>
        <p className='font-bold'>Data Sharing</p>
        <p>
          We do not share your email address or any other personal information
          with third parties, except as required by law or as necessary to
          comply with a legal process.
        </p>
        <p className='font-bold'>Data Security</p>
        <p>
          We take reasonable measures to protect your information from
          unauthorized access, disclosure, alteration, or destruction. However,
          no method of transmission over the internet or electronic storage is
          completely secure, so we cannot guarantee absolute security.
        </p>
        <p className='font-bold'>Changes to this Privacy Policy</p>
        <p>
          We may update this Privacy Policy from time to time. If we make any
          material changes, we will notify you by posting the new Privacy Policy
          on this page.
        </p>
        <p className='font-bold'>Contact Us</p>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at sebastianogirotto05 at gmail dot com.
        </p>
        <p className='font-bold'>Effective Date</p>
        <p>
          This Privacy Policy is effective as of the date indicated below and
          applies to all users of the Website.
        </p>
        <p className='font-bold'>Last Updated: April 2, 2024</p>
        <p>Thank you for using Cronus!</p>
      </div>
    </div>
  );
}
