'use client';

import ChatAssistant from './ChatAssistant';

export default function RightSidebar() {
  return (
    <div className="w-80 h-screen bg-gray-800 backdrop-blur-lg p-6 flex flex-col fixed right-0 top-0">
      <div className="flex-none mb-4">
        <h2 className="text-xl font-bold text-orange-500">AI Assistant</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatAssistant />
      </div>
    </div>
  );
} 