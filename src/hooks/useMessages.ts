import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${chatId},receiver_id.eq.${chatId}`)
          .order('created_at', { ascending: true });

        if (supabaseError) throw supabaseError;

        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${chatId},receiver_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  const sendMessage = async (content: string, receiverId: string) => {
    try {
      const { error } = await supabase.from('messages').insert({
        content,
        sender_id: chatId,
        receiver_id: receiverId,
        read: false,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
}