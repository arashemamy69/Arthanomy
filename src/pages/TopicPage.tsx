import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getArticlesByTopic, urlFor, SanityArticle } from '../lib/sanity';
import { getTopicColor } from '../lib/helpers';
import { useTheme } from '../ThemeContext';

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      if (slug) {
        const data = await getArticlesByTopic(slug);
        setArticles(data);
      }
      setLoading(false);
    }
    fetchArticles();
  }, [slug]);

  // Extract topic title from the first article, or format the slug
  const topicTitle = articles.length > 0 && articles[0].topic 
    ? articles[0].topic.title 
    : slug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <Link to="/" className={`inline-flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 ${theme.textHover} transition-colors`}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <span className={`text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full ${getTopicColor(slug)}`}>
            Topic
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{topicTitle}</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Articles and insights related to {topicTitle}.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`w-8 h-8 border-4 ${theme.borderLight} border-t-current rounded-full animate-spin ${theme.textPrimary}`}></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-black/5 text-center">
          <h2 className="text-2xl font-bold mb-4">No articles found</h2>
          <p className="text-gray-600 mb-8">We couldn't find any articles for this topic yet.</p>
          <Link to="/articles" className={`inline-flex items-center gap-2 font-medium ${theme.textPrimary} hover:underline`}>
            Browse all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <Link to={`/articles/${article.slug.current}`} key={article.slug.current} className="group block h-full">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img 
                    src={article.mainImage ? urlFor(article.mainImage).width(800).height(600).url() : "https://picsum.photos/seed/finance1/800/600"} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-gray-500 font-medium">{article.readTime || '5 min read'}</span>
                  </div>
                  <h3 className={`text-2xl font-bold leading-tight mb-4 ${theme.groupTextHover} transition-colors`}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className={`mt-auto flex items-center gap-2 text-sm font-medium ${theme.textPrimary} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
