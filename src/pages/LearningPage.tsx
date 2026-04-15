import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getAllSeries, SanitySeries } from '../lib/sanity';
import { useTheme } from '../ThemeContext';

export default function LearningPage() {
  const { theme } = useTheme();
  const [seriesList, setSeriesList] = useState<SanitySeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      const data = await getAllSeries();
      setSeriesList(data);
      setLoading(false);
    }
    fetchSeries();
  }, []);

  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Learning Series</h1>
        <p className="text-xl text-gray-600">
          Structured mini-courses designed to take you from beginner to confident investor. Follow these series in order for the best learning experience.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className={`w-8 h-8 border-4 ${theme.borderLight} border-t-current rounded-full animate-spin ${theme.textPrimary}`}></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {seriesList.map((series, i) => (
            <Link to={`/learning/${series.slug.current}`} key={series.slug.current} className="group block h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full bg-white rounded-3xl border border-black/5 p-8 hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${theme.textPrimary} group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Series</span>
                    <h2 className={`text-2xl font-bold ${theme.groupTextHover} transition-colors`}>{series.title}</h2>
                  </div>
                </div>
                
                {series.description && (
                  <p className="text-gray-600 mb-8 flex-1">
                    {series.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
                  <span className="text-sm font-medium text-gray-500">
                    {series.articleCount || 0} Articles
                  </span>
                  <div className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Start Learning <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
