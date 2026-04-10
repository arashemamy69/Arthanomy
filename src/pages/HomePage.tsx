import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, TrendingUp, PieChart, Briefcase, Coins, Scale, 
  BookOpen, Landmark, Home, LineChart, Shield, Globe, Lightbulb, Target,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { getFeaturedArticles, getLatestUpdates, urlFor, SanityArticle } from '../lib/sanity';

const CHART_CONFIG = [
  {
    ticker: "SPY",
    name: "S&P 500 ETF",
    stroke: "#2563eb",
    fill: "url(#colorValueOcean)"
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    stroke: "#4f46e5",
    fill: "url(#colorValueAmethyst)"
  },
  {
    ticker: "XIC.TO",
    name: "iShares Core S&P/TSX Capped Composite",
    stroke: "#059669",
    fill: "url(#colorValueEmerald)"
  }
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <ArticlesAndEducation />
      <LatestUpdates />
      <SamplePortfolios />
      <EssentialReading />
      <ExploreTopics />
      <Newsletter />
    </>
  );
}

function Hero() {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeChart, setActiveChart] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const results = await Promise.all(CHART_CONFIG.map(async (config) => {
          const res = await fetch(`/api/finance/${config.ticker}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const json = await res.json();
          
          const result = json.chart.result[0];
          const closes = result.indicators.quote[0].close;
          
          // Filter out null values
          const validCloses = closes.filter((c: number | null) => c !== null);
          const initialPrice = validCloses[0];
          const finalPrice = validCloses[validCloses.length - 1];

          // Normalize to $10,000 initial investment
          const data = validCloses.map((price: number) => ({
            value: (price / initialPrice) * 10000
          }));

          const returnPct = (((finalPrice - initialPrice) / initialPrice) * 100).toFixed(1);
          const finalValue = (10000 * (finalPrice / initialPrice)).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

          return {
            ...config,
            data,
            finalValue,
            return: Number(returnPct) >= 0 ? `+${returnPct}%` : `${returnPct}%`
          };
        }));
        setChartData(results);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Fallback to empty state or handle error
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const nextChart = () => setActiveChart((prev) => (prev + 1) % chartData.length);
  const prevChart = () => setActiveChart((prev) => (prev - 1 + chartData.length) % chartData.length);

  const currentData = chartData[activeChart];

  useEffect(() => {
    if (chartData.length === 0) return;
    const interval = setInterval(() => {
      setActiveChart((prev) => (prev + 1) % chartData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [chartData.length]);

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
        {loading || !currentData ? (
          <div className="h-[400px] md:h-[480px] bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-black/5 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading live market data...</p>
          </div>
        ) : (
          <div className="h-[400px] md:h-[480px] bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-black/5 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-lg md:text-xl font-bold text-gray-800 mb-1">{currentData.name}</p>
                <p className="text-sm font-medium text-gray-500 mb-1">Growth of $10,000 over 5 years</p>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{currentData.return}</h3>
              </div>
              <div className="flex items-center gap-2 z-10">
                <button onClick={prevChart} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className={`bg-gradient-to-r ${theme.gradientBg} ${theme.textPrimary} border ${theme.borderLight} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}>
                  <TrendingUp className="w-4 h-4" />
                  {currentData.finalValue}
                </div>
                <button onClick={nextChart} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full h-full min-h-[200px] md:min-h-[250px] -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.data}>
                  <defs>
                    <linearGradient id="colorStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={theme.chartStroke} />
                      <stop offset="100%" stopColor={theme.chartStroke} stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="colorValueOcean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorValueSunset" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorValueAmethyst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorValueEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorValueMonochrome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e293b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#1e293b" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorValueGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E7AB8C" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#E7AB8C" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <YAxis domain={['dataMin - 500', 'dataMax + 500']} hide />
                  <Area 
                    key={activeChart}
                    type="monotone" 
                    dataKey="value" 
                    stroke={currentData.stroke} 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill={currentData.fill} 
                    animationDuration={500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="absolute bottom-4 left-6 right-6 md:bottom-6 md:left-8 md:right-8 bg-white/30 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${theme.bgLighter} ${theme.textPrimary} rounded-full flex items-center justify-center shrink-0`}>
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{currentData.ticker}</p>
                  <p className="text-xs text-gray-600 hidden sm:block">{currentData.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{currentData.finalValue}</p>
                <p className={`text-xs ${theme.textSecondary}`}>5Y Return</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

function ArticlesAndEducation() {
  const { theme } = useTheme();
  const [sanityArticles, setSanityArticles] = useState<SanityArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const data = await getFeaturedArticles();
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
      slug: { current: 'tax-advantaged-accounts' },
      category: "Taxes",
      title: "Maximizing Your TFSA and RRSP",
      readTime: "10 min read",
      image: "https://picsum.photos/seed/taxes/800/600"
    },
    {
      slug: { current: 'dividend-investing' },
      category: "Strategy",
      title: "Building a Reliable Dividend Growth Portfolio",
      readTime: "7 min read",
      image: "https://picsum.photos/seed/dividends/800/600"
    },
    {
      slug: { current: 'market-psychology' },
      category: "Mindset",
      title: "Overcoming Market Volatility Anxiety",
      readTime: "6 min read",
      image: "https://picsum.photos/seed/mindset/800/600"
    }
  ];

  const displayArticles = sanityArticles.length > 0 ? sanityArticles.map(a => ({
    slug: a.slug,
    category: a.topic || "Insight",
    title: a.title,
    postType: a.postType || "article",
    readTime: a.readTime || "5 min read",
    image: a.mainImage ? urlFor(a.mainImage).width(800).height(600).url() : "https://picsum.photos/seed/finance1/800/600"
  })) : fallbackArticles;

  // Ensure we have exactly 5 items for the bento grid
  const bentoItems = [...displayArticles, ...fallbackArticles].slice(0, 5);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Articles and Education</h2>
            <p className="text-lg text-gray-600">Evergreen knowledge from decades of real-world experience.</p>
          </div>
          <button className={`hidden md:flex items-center gap-2 font-medium ${theme.textHover} transition-colors`}>
            View all articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Big Card (Left) */}
          {bentoItems[0] && (
            <Link to={`/post/${bentoItems[0].slug?.current || ''}`} className="group block h-full">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="h-full bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col"
              >
                <div className="aspect-[4/3] lg:aspect-auto lg:flex-1 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={bentoItems[0].image} 
                    alt={bentoItems[0].title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-sm font-bold uppercase tracking-wider ${theme.textPrimary}`}>{bentoItems[0].category}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500 font-medium">{bentoItems[0].readTime}</span>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold leading-tight ${theme.groupTextHover} transition-colors`}>
                    {bentoItems[0].title}
                  </h3>
                </div>
              </motion.article>
            </Link>
          )}
          
          {/* 4 Small Cards (Right) */}
          <div className="grid sm:grid-cols-2 gap-6">
            {bentoItems.slice(1, 5).map((article, i) => (
              <Link to={`/post/${article.slug?.current || ''}`} key={i} className="group block h-full">
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
                  className="h-full bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all flex flex-col"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${theme.textPrimary}`}>{article.category}</span>
                    </div>
                    <h3 className={`text-xl font-bold leading-tight ${theme.groupTextHover} transition-colors`}>
                      {article.title}
                    </h3>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
        
        <button className="md:hidden mt-8 w-full flex items-center justify-center gap-2 font-medium py-4 border border-black/10 rounded-full hover:bg-gray-50">
          View all articles <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

function LatestUpdates() {
  const { theme } = useTheme();
  const [substackUpdates, setSubstackUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const res = await fetch('/api/substack');
        const feed = await res.json();
        setSubstackUpdates(feed.items || []);
      } catch (error) {
        console.error("Error fetching substack:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, []);

  const fallbackUpdates = [
    {
      slug: 'dividend-yields',
      category: "Market Update",
      title: "Why Dividend Yields Are Rising in 2026",
      readTime: "5 min read",
      image: "https://picsum.photos/seed/market/800/600"
    },
    {
      slug: 'interest-rates',
      category: "Economy",
      title: "Bank of Canada Holds Rates Steady",
      readTime: "4 min read",
      image: "https://picsum.photos/seed/economy/800/600"
    },
    {
      slug: 'tech-stocks',
      category: "Equities",
      title: "Tech Sector Earnings Beat Expectations",
      readTime: "6 min read",
      image: "https://picsum.photos/seed/tech/800/600"
    }
  ];

  // Helper to extract image from HTML content
  const extractImage = (html: string) => {
    const match = html?.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "https://picsum.photos/seed/market/800/600";
  };

  const displayUpdates = substackUpdates.length > 0 ? substackUpdates.slice(0, 3).map((item: any) => {
    const slug = item.link.split('/p/')[1]?.split('?')[0] || '';
    return {
      slug,
      category: "Substack",
      title: item.title,
      postType: "update",
      readTime: "5 min read",
      image: extractImage(item['content:encoded'] || item.content)
    };
  }) : fallbackUpdates;

  return (
    <section className="py-24 px-6 bg-gray-50 border-y border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Latest Updates</h2>
            <p className="text-lg text-gray-600">Timely market commentary and portfolio adjustments.</p>
          </div>
          <button className={`hidden md:flex items-center gap-2 font-medium ${theme.textHover} transition-colors`}>
            View all updates <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayUpdates.map((update, i) => (
            <Link to={`/substack/${update.slug}`} key={i} className="h-full block">
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer bg-white rounded-3xl border border-black/5 hover:shadow-lg hover:shadow-black/5 transition-all overflow-hidden flex flex-col h-full"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img 
                    src={update.image} 
                    alt={update.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${theme.textPrimary}`}>{update.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 font-medium">{update.readTime}</span>
                  </div>
                  <h3 className={`text-xl font-bold leading-tight mb-4 flex-1 ${theme.groupTextHover} transition-colors`}>
                    {update.title}
                  </h3>
                  <div className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary} opacity-0 group-hover:opacity-100 transition-opacity mt-auto`}>
                    Read Update <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
        <button className="md:hidden mt-8 w-full flex items-center justify-center gap-2 font-medium py-4 border border-black/10 rounded-full hover:bg-gray-50">
          View all updates <ArrowRight className="w-4 h-4" />
        </button>
      </div>
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

function EssentialReading() {
  const { theme } = useTheme();
  const series = [
    "Investing 101: The Absolute Basics",
    "Retirement Planning for Canadians",
    "Tax-Advantaged Accounts (TFSA & RRSP)",
    "Real Estate & REITs",
    "Behavioral Finance: Mastering Your Mind"
  ];

  return (
    <section className="py-24 px-6 bg-white border-t border-black/5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Essential Reading</h2>
          <p className="text-lg text-gray-600">Mini-courses designed to take you from beginner to confident investor.</p>
        </div>
        <div className="flex flex-col gap-4 mb-12">
          {series.map((title, i) => (
            <Link to="#" key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group flex items-center justify-between p-6 md:p-8 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-colors border border-black/5"
              >
                <h3 className={`text-xl md:text-2xl font-bold ${theme.groupTextHover} transition-colors`}>{title}</h3>
                <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 ${theme.textPrimary} group-hover:scale-110 transition-transform`}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <button className={`inline-flex items-center gap-2 font-medium ${theme.textHover} transition-colors`}>
            Explore More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ExploreTopics() {
  const { theme } = useTheme();
  const topics = [
    { name: "Equities", icon: <LineChart className="w-6 h-6" /> },
    { name: "Fixed Income", icon: <Landmark className="w-6 h-6" /> },
    { name: "Real Estate", icon: <Home className="w-6 h-6" /> },
    { name: "Tax Strategy", icon: <Shield className="w-6 h-6" /> },
    { name: "Retirement", icon: <Target className="w-6 h-6" /> },
    { name: "Economics", icon: <Globe className="w-6 h-6" /> },
    { name: "Mindset", icon: <Lightbulb className="w-6 h-6" /> },
    { name: "Beginner", icon: <BookOpen className="w-6 h-6" /> },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore Topics</h2>
          <p className="text-lg text-gray-600">Find exactly what you're looking for by category.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {topics.map((topic, i) => (
            <Link to="#" key={i}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white p-6 rounded-3xl border border-black/5 hover:shadow-md transition-all group flex flex-col items-center text-center gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${theme.textPrimary} group-hover:scale-110 transition-transform`}>
                  {topic.icon}
                </div>
                <h3 className="font-bold text-lg">{topic.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
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
