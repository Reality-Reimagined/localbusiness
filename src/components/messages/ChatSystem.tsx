import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';

interface Chat {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    read: boolean;
  };
}

export function ChatSystem() {
  const { user } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(id, name, profile_image_url),
            receiver:receiver_id(id, name, profile_image_url)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process messages into chats
        const processedChats = messages.reduce((acc: Chat[], message) => {
          const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
          const existingChat = acc.find(chat => chat.otherUser.id === otherUser.id);

          if (!existingChat) {
            acc.push({
              id: otherUser.id,
              otherUser: {
                id: otherUser.id,
                name: otherUser.name,
                avatar: otherUser.profile_image_url,
              },
              lastMessage: {
                content: message.content,
                timestamp: message.created_at,
                read: message.read,
              },
            });
          }

          return acc;
        }, []);

        setChats(processedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${user.id}`,
        },
        (payload) => {
          // Update chats when new message arrives
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-12rem)]">
      <div className="border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          loading={loading}
        />
      </div>

      <div className="md:col-span-2">
        {selectedChatId ? (
          <ChatWindow
            chatId={selectedChatId}
            currentUserId={user?.id || ''}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}