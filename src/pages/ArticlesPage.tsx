import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllArticles, urlFor, SanityArticle } from '../lib/sanity';
import { getTopicColor } from '../lib/helpers';
import { useTheme } from '../ThemeContext';

export default function ArticlesPage() {
  const { theme } = useTheme();
  const [articles, setArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const data = await getAllArticles();
      setArticles(data);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">All Articles</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Browse our complete library of evergreen educational content.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`w-8 h-8 border-4 ${theme.borderLight} border-t-current rounded-full animate-spin ${theme.textPrimary}`}></div>
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
                    {article.topic ? (
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getTopicColor(article.topic.slug.current)}`}>
                        {article.topic.title}
                      </span>
                    ) : (
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${theme.bgLighter} ${theme.textPrimary}`}>
                        Article
                      </span>
                    )}
                    <span className="text-sm text-gray-400">•</span>
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
