import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PortableText } from '@portabletext/react';
import { getPageBySlug, SanityPage } from '../lib/sanity';
import { getPtComponents } from '../lib/portableTextComponents';
import { useTheme } from '../ThemeContext';

export default function PrivacyPage() {
  const { theme } = useTheme();
  const [page, setPage] = useState<SanityPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const data = await getPageBySlug('privacy');
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
          {page?.title || 'Privacy Policy'}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed mb-12">
          {page?.subtitle || 'How we handle your data and protect your privacy.'}
        </p>
        
        <div className="prose prose-lg max-w-none text-gray-600">
          {page?.body ? (
            <PortableText value={page.body} components={getPtComponents(theme)} />
          ) : (
            <>
              <p>
                This is a placeholder for the Privacy Policy. In a production environment, this page would detail what data is collected, how it is used, and how it is protected.
              </p>
              <p>
                If you subscribe to our newsletter, your email address is processed securely via Substack. We do not sell or share your personal information with third parties.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
