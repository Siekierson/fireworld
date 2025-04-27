import { supabase } from '@/lib/supabase';
import { Activity } from '@/types/database';

export const activityController = {
  async createActivity(type: 'like' | 'comment', postID: string, userID: string, message?: string) {
    try {
      // For likes, check if the activity already exists
      if (type === 'like') {
        const { data: existingActivity, error: checkError } = await supabase
          .from('activities')
          .select('*')
          .match({ type, postid: postID, userid: userID })
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw checkError;
        }

        // If activity exists, delete it (unlike)
        if (existingActivity) {
          const { error: deleteError } = await supabase
            .from('activities')
            .delete()
            .match({ activityid: existingActivity.activityid });

          if (deleteError) throw deleteError;
          return { type: 'unlike', postid: postID, userid: userID };
        }
      }

      // Create new activity (like or comment)
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          type,
          postid: postID,
          userid: userID,
          message
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in createActivity:', error);
      throw error;
    }
  },

  async getPostActivities(postID: string) {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          users (name, imageurl)
        `)
        .eq('postid', postID)
        .order('created_at', { ascending: false });

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
        .match({ activityid: activityID, userid: userID });

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
}; 