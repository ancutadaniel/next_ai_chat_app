import React from 'react';

export default function SkeletonChatMessage() {
  return (
    <div className="py-6">
      <div className="mx-auto flex max-w-4xl animate-pulse gap-4 px-4">
        <div className="h-8 w-8 rounded-full bg-gray-600"></div>
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-4 rounded bg-gray-600"></div>
          <div className="h-4 w-5/6 rounded bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
}