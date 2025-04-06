import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  async register(name: string, password: string, imageURL: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, password, imageURL }])
        .select()
        .single();

      if (error) throw error;

      const token = jwt.sign({ userID: data.userID, name: data.name }, JWT_SECRET);
      return { user: data, token };
    } catch (error) {
      throw error;
    }
  },

  async login(name: string, password: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('name', name)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userID: data.userID, name: data.name }, JWT_SECRET);
      return { user: data, token };
    } catch (error) {
      throw error;
    }
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }
}; 