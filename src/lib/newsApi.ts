import axios from 'axios';
import { NewsApiArticle } from '@/types/database';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://api.thenewsapi.com/v1/news';

export const newsApi = {
  async getLatestNews(): Promise<NewsApiArticle[]> {
    try {
      const response = await axios.get(`${BASE_URL}/top`, {
        params: {
          api_token: API_KEY,
          locale: 'us',
          limit: 5
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }
}; 