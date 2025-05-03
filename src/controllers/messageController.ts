import { supabase } from '@/lib/supabase';
import { Message } from '@/types/database';

export const messageController = {
  async sendMessage(userID: string, message: string, toWhoID: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          userID,
          message,
          toWhoID,
          created_at: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getMessages(userID: string, otherUserID: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          users!messages_userID_fkey (name, imageURL)
        `)
        .or(`userID.eq.${userID},toWhoID.eq.${userID}`)
        .or(`userID.eq.${otherUserID},toWhoID.eq.${otherUserID}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  subscribeToMessages(userID: string, callback: (message: Message) => void) {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `toWhoID=eq.${userID}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}; 