import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, PieChart, Briefcase, Coins, Scale } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { getLatestArticles, urlFor, SanityArticle } from '../lib/sanity';

const data = [
  { value: 4000 },
  { value: 4200 },
  { value: 4100 },
  { value: 4600 },
  { value: 4500 },
  { value: 5000 },
  { value: 4800 },
  { value: 5200 },
  { value: 5100 },
  { value: 5400 },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <SamplePortfolios />
      <LatestArticles />
      <Newsletter />
    </>
  );
}

function Hero() {
  const { theme } = useTheme();
  return (
    <section className="pt-20 md:pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
          Invest Smarter.<br />
          Build Wealth.<br />
          <span className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}>Live Free.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
          Financial freedom is achievable for anyone willing to learn. Genuine, lived investing experience for Canadians taking control of their future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-black transition-colors flex items-center justify-center gap-2 group">
            Start Learning
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white border border-black/10 text-[#1a1a1a] px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
            View Portfolios
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="aspect-square md:aspect-[4/3] bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-black/5 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Portfolio Value</p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">$1,245,890.50</h3>
            </div>
            <div className={`bg-gradient-to-r ${theme.gradientBg} ${theme.textPrimary} border ${theme.borderLight} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
              <TrendingUp className="w-4 h-4" />
              +8.4%
            </div>
          </div>
          <div className="flex-1 w-full h-full min-h-[150px] md:min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={theme.chartStroke} />
                    <stop offset="100%" stopColor={theme.chartStroke} stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chartStroke} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={theme.chartStroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                <Area type="monotone" dataKey="value" stroke="url(#colorStroke)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-[#f8f7f5] rounded-2xl p-4 border border-black/5 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${theme.bgLighter} ${theme.textPrimary} rounded-full flex items-center justify-center shrink-0`}>
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">VGRO.TO</p>
                <p className="text-xs text-gray-500 hidden sm:block">Vanguard Growth ETF</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">$34.52</p>
              <p className={`text-xs ${theme.textSecondary}`}>+0.45%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function SamplePortfolios() {
  const { theme } = useTheme();
  const portfolios = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Classic Portfolio",
      desc: "A traditional mix of equities and fixed income for steady, reliable long-term growth."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Portfolio",
      desc: "Equities-focused approach designed to maximize capital appreciation over a longer time horizon."
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Income Portfolio",
      desc: "Dividend and yield-focused strategy to generate consistent cash flow during the drawdown phase."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Balanced Portfolio",
      desc: "An optimal 60/40 split providing a smooth ride through market volatility while capturing growth."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Model Portfolios</h2>
        <p className="text-lg text-gray-600">See what a thoughtfully constructed portfolio looks like in practice. Transparent, educational examples for every phase of your journey.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolios.map((portfolio, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 bg-[#f8f7f5] rounded-2xl flex items-center justify-center text-[#1a1a1a] mb-6 ${theme.groupBgHover} ${theme.groupTextHover} transition-colors`}>
              {portfolio.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{portfolio.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{portfolio.desc}</p>
            <div className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary} opacity-0 group-hover:opacity-100 transition-opacity`}>
              View Details <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function LatestArticles() {
  const { theme } = useTheme();
  const [sanityArticles, setSanityArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const data = await getLatestArticles();
      setSanityArticles(data);
      setLoading(false);
    }
    fetchArticles();
  }, []);

  const fallbackArticles = [
    {
      slug: { current: 'couch-potato' },
      category: "Investing 101",
      title: "The Canadian Couch Potato Strategy Explained",
      readTime: "8 min read",
      image: "https://picsum.photos/seed/finance1/800/600"
    },
    {
      slug: { current: 'reits-vs-real-estate' },
      category: "Real Estate",
      title: "REITs vs. Physical Real Estate: Which is Better?",
      readTime: "12 min read",
      image: "https://picsum.photos/seed/realestate/800/600"
    },
    {
      slug: { current: 'dividend-yields' },
      category: "Market Update",
      title: "Why Dividend Yields Are Rising in 2026",
      readTime: "5 min read",
      image: "https://picsum.photos/seed/market/800/600"
    }
  ];

  const displayArticles = sanityArticles.length > 0 ? sanityArticles.map(a => ({
    slug: a.slug,
    category: a.category || "Article",
    title: a.title,
    readTime: a.readTime || "5 min read",
    image: a.mainImage ? urlFor(a.mainImage).width(800).height(600).url() : "https://picsum.photos/seed/finance1/800/600"
  })) : fallbackArticles;

  return (
    <section className="py-24 px-6 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Latest Insights</h2>
            <p className="text-lg text-gray-600">Knowledge from decades of real-world experience.</p>
          </div>
          <button className={`hidden md:flex items-center gap-2 font-medium ${theme.textHover} transition-colors`}>
            View all articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayArticles.map((article, i) => (
            <Link to={`/post/${article.slug?.current || ''}`} key={i}>
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${theme.textPrimary}`}>{article.category}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-medium">{article.readTime}</span>
                </div>
                <h3 className={`text-2xl font-bold leading-tight ${theme.groupTextHover} transition-colors`}>
                  {article.title}
                </h3>
              </motion.article>
            </Link>
          ))}
        </div>
        <button className="md:hidden mt-8 w-full flex items-center justify-center gap-2 font-medium py-4 border border-black/10 rounded-full hover:bg-gray-50">
          View all articles <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

function Newsletter() {
  const { theme } = useTheme();
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-slate-800 rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute -top-[50%] -left-[10%] w-[70%] h-[150%] ${theme.newsletterBg1} rounded-full blur-3xl transform rotate-12`}></div>
          <div className={`absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] ${theme.newsletterBg2} rounded-full blur-3xl transform -rotate-12`}></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Join the Arthanomy Community</h2>
          <p className={`text-lg ${theme.newsletterText} mb-10`}>
            Get actionable insights, market commentary, and portfolio updates delivered straight to your inbox. No spam, just value.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button type="submit" className={`bg-white text-slate-900 px-8 py-4 rounded-full font-bold ${theme.bgLightHover} transition-colors`}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
