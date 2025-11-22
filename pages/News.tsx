
import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';
import { BlogPost, PostCategory } from '../types';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

const NewsCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine if the text is long enough to warrant a "See More" button.
  // 150 characters is roughly 2-3 lines of text depending on screen size.
  const isLongText = post.content.length > 150;

  const getBadgeColor = (cat: PostCategory) => {
    switch (cat) {
      case PostCategory.REUNION: return 'bg-amber-100 text-amber-800';
      case PostCategory.EVENT: return 'bg-green-100 text-green-800';
      case PostCategory.ANNOUNCEMENT: return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {post.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(post.category)}`}>
            {post.category}
          </span>
          <span className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</h3>
        <p className="text-xs text-gray-500 font-medium mb-3">By {post.author || 'Admin'}</p>
        
        <div className="flex-1 mb-4">
          <p className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>
            {post.content}
          </p>
        </div>

        {isLongText && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start mt-auto focus:outline-none"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        )}
      </div>
    </Card>
  );
};

const News: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay for better UX demonstration
    const timer = setTimeout(() => {
      setPosts(StorageService.getPosts());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="flex flex-col h-full">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">School News & Events</h2>
        <p className="mt-2 text-gray-600">The latest updates from our vibrant community.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No news posts available yet.
        </div>
      )}
    </div>
  );
};

export default News;
