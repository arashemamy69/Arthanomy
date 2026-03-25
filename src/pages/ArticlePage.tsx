import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Markdown from 'react-markdown';
import { getArticleBySlug, urlFor } from '../lib/sanity';
import { useTheme } from '../ThemeContext';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [article, setArticle] = useState<any>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (slug) {
        const data = await getArticleBySlug(slug);
        setArticle(data);
        
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
    category: "Investing 101",
    readTime: "8 min read",
    authorName: "Arash Emamy",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/seed/finance1/1200/600",
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

  const imageUrl = article?.mainImage ? urlFor(article.mainImage).width(1200).height(600).url() : displayArticle.image;
  
  const formattedDate = displayArticle.publishedAt 
    ? new Date(displayArticle.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently Published';

  // Custom components for PortableText to style the rich text
  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) {
          return null;
        }
        return (
          <img
            alt={value.alt || ' '}
            loading="lazy"
            src={urlFor(value).width(800).fit('max').auto('format').url()}
            className="rounded-2xl my-8 w-full"
          />
        );
      }
    },
    block: {
      h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-12 mb-6">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-3xl font-bold mt-10 mb-5">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>,
      h4: ({ children }: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
      normal: ({ children }: any) => <p className="text-lg leading-relaxed text-gray-700 mb-6">{children}</p>,
      blockquote: ({ children }: any) => <blockquote className={`border-l-4 ${theme.borderLight} pl-4 italic text-gray-600 my-6`}>{children}</blockquote>,
    },
    marks: {
      link: ({ children, value }: any) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
        return (
          <a href={value.href} rel={rel} className={`${theme.textPrimary} hover:underline`}>
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-lg text-gray-700 space-y-2">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-lg text-gray-700 space-y-2">{children}</ol>,
    },
  };

  return (
    <article className="pb-24">
      {/* Header Section */}
      <header className="pt-16 pb-12 px-6 max-w-4xl mx-auto">
        <Link to="/" className={`inline-flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 ${theme.textHover} transition-colors`}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-sm font-bold uppercase tracking-wider ${theme.textPrimary}`}>{displayArticle.category}</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-gray-500 font-medium">{displayArticle.readTime}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8">
          {displayArticle.title}
        </h1>
        
        <div className="flex items-center gap-4">
          {displayArticle.authorImage ? (
            <img 
              src={urlFor(displayArticle.authorImage).width(100).height(100).url()} 
              alt={displayArticle.authorName} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full ${theme.bgLighter} flex items-center justify-center`}>
              <span className={`font-bold ${theme.textPrimary}`}>{displayArticle.authorName?.charAt(0) || 'A'}</span>
            </div>
          )}
          <div>
            <p className="font-medium">{displayArticle.authorName || 'Arthanomy Editor'}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="px-6 max-w-6xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="aspect-[21/9] md:aspect-[2.5/1] rounded-[2rem] overflow-hidden bg-gray-100"
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
      </div>
    </article>
  );
}
