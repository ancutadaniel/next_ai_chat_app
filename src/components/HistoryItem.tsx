'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteConversation } from '@/app/actions';
import TrashIcon from './icons/TrashIcon';

interface HistoryItemProps {
  chat: {
    id: string;
    title: string;
  };
}

export default function HistoryItem({ chat }: HistoryItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteConversation(chat.id);
    });
  };

  return (
    <>
      <div className="group relative">
        <Link
          href={`/chat/${chat.id}`}
          className="block rounded-md p-3 text-sm text-[var(--studio-text-secondary)] hover:bg-white/10 truncate"
        >
          {chat.title}
        </Link>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-md hover:bg-white/20"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--studio-sidebar)] rounded-lg p-6 shadow-xl border border-[var(--studio-border)]">
            <h2 className="text-lg font-semibold mb-4">Delete chat?</h2>
            <p className="mb-6 text-sm text-[var(--studio-text-secondary)]">{`This will delete "${chat.title}" permanently.`}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md hover:bg-white/10"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-900"
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}