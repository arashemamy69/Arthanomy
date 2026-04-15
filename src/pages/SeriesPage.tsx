import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { getSeriesBySlug, SanitySeries } from '../lib/sanity';
import { useTheme } from '../ThemeContext';

export default function SeriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [series, setSeries] = useState<SanitySeries | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      if (slug) {
        const data = await getSeriesBySlug(slug);
        setSeries(data);
      }
      setLoading(false);
    }
    fetchSeries();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className={`w-8 h-8 border-4 ${theme.borderLight} border-t-current rounded-full animate-spin ${theme.textPrimary}`}></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="pt-24 pb-24 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Series not found</h1>
        <p className="text-gray-600 mb-8">The learning series you are looking for does not exist.</p>
        <Link to="/learning" className={`inline-flex items-center gap-2 font-medium ${theme.textPrimary} hover:underline`}>
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-16">
        <Link to="/learning" className={`inline-flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 ${theme.textHover} transition-colors`}>
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${theme.textPrimary}`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Learning Series
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{series.title}</h1>
        {series.description && (
          <p className="text-xl text-gray-600 leading-relaxed">
            {series.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {series.articles && series.articles.length > 0 ? (
          series.articles.map((article, i) => (
            <Link to={`/articles/${article.slug.current}`} key={article.slug.current} className="group block">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 md:p-8 bg-white rounded-3xl border border-black/5 hover:border-black/10 hover:shadow-md transition-all"
              >
                <div className={`text-4xl font-bold text-gray-200 group-hover:${theme.textPrimary} transition-colors shrink-0`}>
                  {String(article.partNumber || i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${theme.groupTextHover} transition-colors`}>
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 ${theme.textPrimary} group-hover:scale-110 transition-transform`}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="bg-gray-50 p-12 rounded-3xl border border-black/5 text-center">
            <p className="text-gray-600">No articles have been added to this series yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
