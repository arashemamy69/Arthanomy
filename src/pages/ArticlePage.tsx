import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Markdown from 'react-markdown';
import { getArticleBySlug, getRelatedArticles, urlFor, SanityArticle } from '../lib/sanity';
import { getPtComponents } from '../lib/portableTextComponents';
import { getTopicColor } from '../lib/helpers';
import { useTheme } from '../ThemeContext';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<SanityArticle[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (slug) {
        const data = await getArticleBySlug(slug);
        setArticle(data);
        
        const related = await getRelatedArticles(slug);
        setRelatedArticles(related);
        
        if (data?.markdownUrl) {
          try {
            const res = await fetch(data.markdownUrl);
            const text = await res.text();
            setMarkdownContent(text);
          } catch (e) {
            console.error("Failed to fetch markdown content:", e);
          }
        }
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  // Manage canonical URL
  useEffect(() => {
    if (!slug) return;
    
    const canonicalUrl = `${window.location.origin}/articles/${slug}`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    let created = false;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
      created = true;
    }
    
    const originalHref = link.href;
    link.href = canonicalUrl;

    return () => {
      if (created && link) {
        document.head.removeChild(link);
      } else if (link) {
        link.href = originalHref;
      }
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className={`w-8 h-8 border-4 ${theme.borderLight} border-t-current rounded-full animate-spin ${theme.textPrimary}`}></div>
      </div>
    );
  }

  // Fallback content if article not found (or if Sanity is not connected yet)
  const displayArticle = article || {
    title: "The Canadian Couch Potato Strategy Explained",
    topic: { title: "Investing 101", slug: { current: "investing-101" } },
    readTime: "8 min read",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/seed/finance1/1200/675",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "This is a fallback article because Sanity is either not connected or the article was not found. Once you connect your Sanity project ID and create an article with this slug, it will appear here." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "What is the Couch Potato Strategy?" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "The Couch Potato strategy is a method of investing that uses index funds to build a diversified portfolio with very low fees. It is designed to be simple to manage and easy to understand." }]
      }
    ]
  };

  const imageUrl = article?.mainImage ? urlFor(article.mainImage).width(1200).height(675).url() : displayArticle.image;
  
  const formattedDate = displayArticle.publishedAt 
    ? new Date(displayArticle.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently Published';

  // Custom components for PortableText to style the rich text
  const ptComponents = getPtComponents(theme);

  // Find prev/next in series if applicable
  let prevArticle = null;
  let nextArticle = null;
  if (displayArticle.series && displayArticle.series.articles) {
    const currentIndex = displayArticle.series.articles.findIndex((a: any) => a.slug.current === displayArticle.slug?.current);
    if (currentIndex > 0) {
      prevArticle = displayArticle.series.articles[currentIndex - 1];
    }
    if (currentIndex !== -1 && currentIndex < displayArticle.series.articles.length - 1) {
      nextArticle = displayArticle.series.articles[currentIndex + 1];
    }
  }

  return (
    <article className="pb-24">
      {/* Header Section */}
      <header className="pt-16 pb-12 px-6 max-w-3xl mx-auto">
        <Link to="/" className={`inline-flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 ${theme.textHover} transition-colors`}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          {displayArticle.topic ? (
            <Link 
              to={`/topic/${displayArticle.topic.slug.current}`}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-opacity hover:opacity-80 ${getTopicColor(displayArticle.topic.slug.current)}`}
            >
              {displayArticle.topic.title}
            </Link>
          ) : (
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${theme.bgLighter} ${theme.textPrimary}`}>
              Article
            </span>
          )}
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500 font-medium">{displayArticle.readTime}</span>
        </div>
        
        {displayArticle.tags && displayArticle.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {displayArticle.tags.map((tag: any, index: number) => (
              <Link 
                to={`/tag/${tag.slug.current}`} 
                key={index} 
                className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          {displayArticle.title}
        </h1>

        {displayArticle.subtitle && (
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
            {displayArticle.subtitle}
          </p>
        )}
        
        <div className="flex items-center gap-4">
          {displayArticle.author?.photo ? (
            <img 
              src={urlFor(displayArticle.author.photo).width(96).height(96).url()} 
              alt={displayArticle.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full ${theme.bgLighter} flex items-center justify-center`}>
              <span className={`font-bold ${theme.textPrimary}`}>
                {displayArticle.author?.name ? displayArticle.author.name.charAt(0) : 'A'}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium">{displayArticle.author?.name || 'Arthanomy Editor'}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="px-6 max-w-3xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="aspect-video rounded-[2rem] overflow-hidden bg-gray-100"
        >
          <img 
            src={imageUrl} 
            alt={displayArticle.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Article Body */}
      <div className="px-6 max-w-3xl mx-auto">
        {displayArticle.series && (
          <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${theme.textPrimary} shrink-0 shadow-sm`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Part {displayArticle.partNumber || 1} of Series
                </p>
                <Link to={`/learning/${displayArticle.series.slug.current}`} className={`text-lg font-bold ${theme.textHover} transition-colors`}>
                  {displayArticle.series.title}
                </Link>
              </div>
            </div>
            <Link to={`/learning/${displayArticle.series.slug.current}`} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              View all parts &rarr;
            </Link>
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600">
          {markdownContent ? (
            <Markdown>{markdownContent}</Markdown>
          ) : article?.markdownText ? (
            <Markdown>{article.markdownText}</Markdown>
          ) : article?.body ? (
            <PortableText value={article.body} components={ptComponents} />
          ) : (
            <PortableText value={displayArticle.body} components={ptComponents} />
          )}
        </div>

        {/* Series Prev/Next Navigation */}
        {displayArticle.series && (prevArticle || nextArticle) && (
          <div className="mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row gap-4 justify-between">
            {prevArticle ? (
              <Link to={`/articles/${prevArticle.slug.current}`} className="flex-1 p-6 rounded-2xl border border-black/5 hover:border-black/10 hover:bg-gray-50 transition-all group">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous Part
                </p>
                <p className={`font-bold ${theme.groupTextHover} transition-colors line-clamp-2`}>{prevArticle.title}</p>
              </Link>
            ) : <div className="flex-1"></div>}
            
            {nextArticle ? (
              <Link to={`/articles/${nextArticle.slug.current}`} className="flex-1 p-6 rounded-2xl border border-black/5 hover:border-black/10 hover:bg-gray-50 transition-all group text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-end gap-1">
                  Next Part <ArrowRight className="w-3 h-3" />
                </p>
                <p className={`font-bold ${theme.groupTextHover} transition-colors line-clamp-2`}>{nextArticle.title}</p>
              </Link>
            ) : <div className="flex-1"></div>}
          </div>
        )}

        {/* Author Bio */}
        {displayArticle.author && (
          <div className="mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row gap-6 items-start">
            {displayArticle.author.photo ? (
              <img 
                src={urlFor(displayArticle.author.photo).width(160).height(160).url()} 
                alt={displayArticle.author.name}
                className="w-20 h-20 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className={`w-20 h-20 rounded-full ${theme.bgLighter} flex items-center justify-center shrink-0`}>
                <span className={`text-2xl font-bold ${theme.textPrimary}`}>
                  {displayArticle.author.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold mb-2">{displayArticle.author.name}</h3>
              {displayArticle.author.bio && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {displayArticle.author.bio}
                </p>
              )}
              <div className="flex items-center gap-4">
                {displayArticle.author.linkedinUrl && (
                  <a href={displayArticle.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                    LinkedIn Profile
                  </a>
                )}
                {displayArticle.author.substackUrl && (
                  <a href={displayArticle.author.substackUrl} target="_blank" rel="noopener noreferrer" className={`text-sm font-medium ${theme.textPrimary} hover:underline`}>
                    Substack
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-black/10">
          <p className="text-sm italic text-gray-500 leading-relaxed">
            Content on Arthanomy is for educational and informational purposes only and does not constitute financial, investment, tax, or legal advice. Authors are not licensed financial advisors. Always do your own research and consult a qualified professional before making any financial decisions. Some content on this site may have been created with the assistance of Artificial Intelligence and may contain errors. Arthanomy may receive affiliate and ad compensation.
          </p>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedArticles.map((relArticle, index) => (
              <motion.div 
                key={relArticle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer flex flex-col h-full"
              >
                <Link to={`/articles/${relArticle.slug.current}`} className="flex flex-col h-full">
                  <div className="relative h-48 mb-6 overflow-hidden rounded-[1.5rem]">
                    <img 
                      src={relArticle.mainImage ? urlFor(relArticle.mainImage).url() : "https://picsum.photos/seed/invest/800/600"} 
                      alt={relArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute top-4 left-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getTopicColor(relArticle.topic?.slug?.current)}`}>
                      {relArticle.topic?.title || 'Education'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relArticle.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-auto pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(relArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {relArticle.readTime || '5 min read'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
