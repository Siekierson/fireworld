'use client';

import Image from 'next/image';
import { NewsApiArticle } from '@/types/database';

interface NewsCardProps {
  article: NewsApiArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white">
      <div className="flex flex-col md:flex-row gap-6">
        {article.image_url && (
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-orange-400">
            {article.title}
          </h3>
          <p className="text-gray-300 mb-4">{article.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {new Date(article.published_at).toLocaleDateString()}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 