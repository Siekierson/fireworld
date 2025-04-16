import { supabase } from '@/lib/supabase';
import { Post } from '@/types/database';

export const postController = {
  async createPost(text: string, ownerID: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ text, ownerid: ownerID, date: new Date() }])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  },

  async getPosts() {
    try {
      console.log('Fetching posts from Supabase...');
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (name, imageurl),
          activities (*)
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error in getPosts:', error);
        throw error;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        return [];
      }

      console.log('Successfully fetched posts:', data);
      return data;
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  },

  async deletePost(postID: string, ownerID: string) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ postid: postID, ownerid: ownerID });

      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  },

  async getUserPosts(userID: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (name, imageurl),
          activities (*)
        `)
        .eq('ownerid', userID)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error getting user posts:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getUserPosts:', error);
      throw error;
    }
  }
}; 