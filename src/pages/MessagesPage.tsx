import React, { useState } from 'react';
import { ChatList } from '../components/messages/ChatList';
import { ChatWindow } from '../components/messages/ChatWindow';
import { useMessages } from '../hooks/useMessages';
import { useAuthStore } from '../store/useAuthStore';

export function MessagesPage() {
  const { user } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { messages, loading, error, sendMessage } = useMessages(selectedChatId || '');

  // This would normally be fetched from your backend
  const mockChats = [
    {
      id: '1',
      otherUser: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      lastMessage: {
        content: 'Hey, are you available for a project?',
        timestamp: new Date().toISOString(),
        read: false,
      },
    },
    // Add more mock chats as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
          <div className="border-r">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <ChatList
              chats={mockChats}
              selectedChatId={selectedChatId || undefined}
              onChatSelect={setSelectedChatId}
            />
          </div>

          <div className="md:col-span-2">
            {selectedChatId ? (
              <ChatWindow
                messages={messages}
                currentUserId={user?.id || ''}
                onSendMessage={(content) => {
                  if (selectedChatId) {
                    sendMessage(content, selectedChatId);
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}