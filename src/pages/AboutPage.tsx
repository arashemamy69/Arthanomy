import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PortableText } from '@portabletext/react';
import { getPageBySlug, SanityPage } from '../lib/sanity';
import { getPtComponents } from '../lib/portableTextComponents';
import { useTheme } from '../ThemeContext';

export default function AboutPage() {
  const { theme } = useTheme();
  const [page, setPage] = useState<SanityPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const data = await getPageBySlug('about');
      setPage(data);
      setLoading(false);
    }
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 px-6 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {page?.title || 'About Arthanomy'}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          {page?.subtitle || 'Demystifying finance and investing for Canadians.'}
        </p>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          {page?.body ? (
            <PortableText value={page.body} components={getPtComponents(theme)} />
          ) : (
            <>
              <p>
                Arthanomy was founded with a simple mission: to provide clear, actionable, and unbiased financial education. 
                We believe that financial freedom is achievable for anyone willing to learn the fundamentals of investing.
              </p>
              <p>
                Our approach is rooted in long-term, evidence-based investing. We cut through the noise of daily market fluctuations 
                to focus on what truly matters: asset allocation, low fees, and consistent compounding.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
