export interface User {
  userID: string;
  name: string;
  password: string;
  imageURL?: string;
  created_at: string;
}

export interface Message {
  messageID: string;
  userID: string;
  message: string;
  toWhoID: string;
  created_at: string;
}

export interface Post {
  postID: string;
  text: string;
  ownerid: string;
  created_at: string;
  users?: {
    name: string;
    imageurl?: string;
  };
  activities?: Array<{
    type: 'like' | 'comment';
    userID: string;
    message?: string;
  }>;
}

export interface Activity {
  activityID: string;
  type: 'like' | 'comment';
  postID: string;
  userID: string;
  message?: string;
  created_at: string;
}

export interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  image_url?: string;
  published_at: string;
} 