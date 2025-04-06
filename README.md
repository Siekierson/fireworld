# FireWorld

A modern social media platform built with Next.js and Supabase, featuring real-time messaging and news integration.

## Features

- User authentication with JWT
- Real-time messaging using Supabase's real-time subscriptions
- Post creation and interaction (likes and comments)
- News integration with TheNewsAPI
- Modern, responsive UI with a fire-themed design
- Profile management

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Supabase (Database & Real-time subscriptions)
- Tailwind CSS
- TheNewsAPI Integration
- JWT Authentication

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- TheNewsAPI account

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fireworld.git
   cd fireworld
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   NEWS_API_KEY=your_news_api_key
   ```

4. Set up your Supabase database with the following tables:
   - users (userID, name, password, imageURL)
   - messages (messageID, userID, message, toWhoID, date)
   - posts (postID, date, text, ownerID)
   - activities (activityID, type, postID, message, date)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
├── controllers/        # Business logic
├── lib/               # Utilities and configurations
├── models/            # Database models
├── types/             # TypeScript types
└── utils/             # Helper functions
```

## API Routes

- `/api/auth` - Authentication endpoints (login, register)
- `/api/posts` - Post management
- `/api/activity` - Post interactions (likes, comments)
- `/api/messages` - Real-time messaging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# fireworld
# fireworld
