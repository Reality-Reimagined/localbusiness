import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: string;
  otherUser: {
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    read: boolean;
  };
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
            selectedChatId === chat.id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex-shrink-0">
            {chat.otherUser.avatar ? (
              <img
                src={chat.otherUser.avatar}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {chat.otherUser.name[0]}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {chat.otherUser.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
              </p>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {chat.lastMessage.content}
            </p>
          </div>
          
          {!chat.lastMessage.read && (
            <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}