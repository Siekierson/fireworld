import { supabase } from '@/lib/supabase';
import { Post } from '@/types/database';

export const postController = {
  async createPost(text: string, ownerID: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ text, ownerID, date: new Date() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (name, imageURL),
          activities (*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async deletePost(postID: string, ownerID: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ postID, ownerID });

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  },

  async getUserPosts(userID: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (name, imageURL),
          activities (*)
        `)
        .eq('ownerID', userID)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
}; 