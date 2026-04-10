import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostPage() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch from our substack proxy
        const res = await fetch('/api/substack');
        const feed = await res.json();
        
        // Find the post by slug (we'll generate a slug from the title or link)
        // Substack links are like https://netinterest.substack.com/p/the-post-slug
        const found = feed.items.find((item: any) => {
          const itemSlug = item.link.split('/p/')[1]?.split('?')[0];
          return itemSlug === slug;
        });

        if (found) {
          setPost(found);
        } else {
          // Fallback to first item if not found just for demo
          setPost(feed.items[0]);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">Return home</Link>
      </div>
    );
  }

  // Extract a clean date
  const pubDate = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link to="/" className={`inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:${theme.textPrimary} mb-8 transition-colors`}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-sm font-bold uppercase tracking-wider ${theme.textPrimary}`}>Substack</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-12 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-900">{post.creator || 'Author'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{pubDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Render the raw HTML from Substack */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post['content:encoded'] || post.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <h3 className="text-2xl font-bold mb-4">Enjoyed this post?</h3>
            <p className="text-gray-600 mb-6">Subscribe to get the latest updates directly in your inbox.</p>
            <a 
              href="https://netinterest.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-lg text-white ${theme.bgPrimary} hover:opacity-90 transition-opacity`}
            >
              Subscribe on Substack
            </a>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
