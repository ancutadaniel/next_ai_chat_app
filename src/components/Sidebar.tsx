import React from 'react';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';

export default async function Sidebar() {
  const session = await auth();

  return (
    <div className="flex h-full flex-col bg-gray-800 p-4 text-white">
      <div className="flex-1">
        <h1 className="mb-4 text-xl font-bold">AI Chat</h1>
        <ul>
          <li className="mb-2">
            <a href="#" className="block rounded-md p-2 hover:bg-gray-700">
              Chat History 1
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="block rounded-md p-2 hover:bg-gray-700">
              Chat History 2
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        {session?.user ? (
          <SignOutButton userName={session.user.name ?? 'User'} />
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
}