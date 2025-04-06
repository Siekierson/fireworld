export interface User {
  userID: string;
  name: string;
  password: string;
  imageURL: string;
}

export interface Message {
  messageID: string;
  userID: string;
  message: string;
  toWhoID: string;
  date: Date;
}

export interface Post {
  postID: string;
  date: Date;
  text: string;
  ownerID: string;
  users?: {
    name: string;
    imageURL: string;
  };
  activities?: Array<{
    type: 'Like' | 'Comment';
    userID: string;
    message?: string;
  }>;
}

export interface Activity {
  activityID: string;
  type: 'Like' | 'Comment';
  postID: string;
  message?: string;
  date: Date;
}

export interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  image_url?: string;
  published_at: string;
} 