import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PortableText } from '@portabletext/react';
import { getPageBySlug, SanityPage } from '../lib/sanity';
import { getPtComponents } from '../lib/portableTextComponents';
import { useTheme } from '../ThemeContext';

export default function DisclaimerPage() {
  const { theme } = useTheme();
  const [page, setPage] = useState<SanityPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const data = await getPageBySlug('disclaimer');
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
          {page?.title || 'Disclaimer'}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          {page?.subtitle || 'Important legal information regarding the content on this site.'}
        </p>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          {page?.body ? (
            <PortableText value={page.body} components={getPtComponents(theme)} />
          ) : (
            <>
              <p>
                The content provided on Arthanomy is for educational and informational purposes only. It does not constitute financial, investment, legal, or tax advice.
              </p>
              <p>
                Investing in the stock market involves risk, including the potential loss of principal. The model portfolios and strategies discussed on this site are examples and may not be suitable for your specific financial situation.
              </p>
              <p>
                Always conduct your own due diligence or consult with a certified financial planner or registered investment advisor before making any investment decisions. Arthanomy and its authors are not liable for any financial losses or damages incurred as a result of using the information provided on this platform.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
