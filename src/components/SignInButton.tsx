'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction } from '@/app/actions';
import LoadingSpinner from './icons/LoadingSpinner'; // Import the new component

function SignInButtonContent() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500 flex items-center gap-2 disabled:bg-blue-800"
      disabled={pending}
    >
      {pending ? (
        <>
          <LoadingSpinner />
          Signing In...
        </>
      ) : (
        'Sign in with GitHub'
      )}
    </button>
  );
}

export default function SignInButton() {
  return (
    <form action={signInAction}>
      <SignInButtonContent />
    </form>
  );
}