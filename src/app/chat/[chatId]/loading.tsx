import React from 'react';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import SkeletonChatMessage from '@/components/SkeletonChatMessage';

export default function LoadingChatPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner className="h-8 w-8 text-[var(--studio-accent)]" />
        </div>
        <div className="opacity-20">
          <SkeletonChatMessage />
          <SkeletonChatMessage />
          <SkeletonChatMessage />
        </div>
      </div>
      <div className="p-4">
        <div className="relative mx-auto max-w-4xl">
          <div className="h-[56px] w-full rounded-full bg-gray-600 opacity-20"></div>
        </div>
      </div>
    </div>
  );
}