import React from 'react';
import { auth } from '@/auth';
import { getChatHistory } from '@/app/actions';
import SidebarContent from './SidebarContent';

export default async function Sidebar() {
  const session = await auth();
  const history = session ? await getChatHistory() : [];

  return (
    <SidebarContent
      session={session}
      history={history}
    />
  );
}
