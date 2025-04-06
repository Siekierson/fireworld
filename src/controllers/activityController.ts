import { supabase } from '@/lib/supabase';
import { Activity } from '@/types/database';

export const activityController = {
  async createActivity(type: 'Like' | 'Comment', postID: string, userID: string, message?: string) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          type,
          postID,
          userID,
          message,
          date: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getPostActivities(postID: string) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          users (name, imageURL)
        `)
        .eq('postID', postID)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteActivity(activityID: string, userID: string) {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .match({ activityID, userID });

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
}; 