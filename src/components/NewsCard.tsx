'use client';

import Image from 'next/image';
import { NewsApiArticle } from '@/types/database';

interface NewsCardProps {
  article: NewsApiArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  if (!article) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg text-black">
      <div className="flex flex-col md:flex-row gap-6">
        {article?.image_url ? (
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title || 'News image'}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : null}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-orange-600">
            {article.title}
          </h3>
          <p className="text-gray-800 mb-4">{article.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'No date'}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 