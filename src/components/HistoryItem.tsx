'use client';

import React, { useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { deleteConversation, updateConversationTitle } from '@/app/actions';
import TrashIcon from './icons/TrashIcon';

interface HistoryItemProps {
  chat: {
    id: string;
    title: string;
  };
  onNavigate?: () => void;
}

export default function HistoryItem({ chat, onNavigate }: HistoryItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteConversation(chat.id);
    });
  };

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      startTransition(() => {
        updateConversationTitle(chat.id, editTitle.trim());
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="group relative">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md bg-white/10 p-3 text-sm text-[var(--studio-text-primary)] outline-none ring-1 ring-[var(--studio-accent)]"
            autoFocus
          />
        ) : (
          <Link
            href={`/chat/${chat.id}`}
            onClick={onNavigate}
            onDoubleClick={(e) => {
              e.preventDefault();
              setIsEditing(true);
            }}
            className="block rounded-md p-3 text-sm text-[var(--studio-text-secondary)] hover:bg-white/10 truncate"
          >
            {chat.title}
          </Link>
        )}
        {!isEditing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-md hover:bg-white/20"
              title="Rename"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
              </svg>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 rounded-md hover:bg-white/20"
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && typeof document !== 'undefined' && createPortal(
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
        </div>,
        document.body
      )}
    </>
  );
}
