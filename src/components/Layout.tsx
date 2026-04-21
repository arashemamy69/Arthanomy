import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { useTheme, themes, ThemeKey } from '../ThemeContext';
import { getAllArticles, SanityArticle } from '../lib/sanity';

export default function Layout() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen bg-[#f8f7f5] text-[#1a1a1a] font-sans ${theme.selection}`}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ThemeSwitcher />
    </div>
  );
}

function Navbar() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sanityArticles, setSanityArticles] = useState<SanityArticle[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const articles = await getAllArticles();
        setSanityArticles(articles);
      } catch (err) {
        console.error("Failed to load sanity articles for search", err);
      }
    }
    fetchArticles();
  }, []);

  const staticIndex = [
    { title: 'Home', path: '/' },
    { title: 'Learning Center', path: '/learning' },
    { title: 'Articles', path: '/articles' },
    { title: 'Portfolios', path: '/portfolios' },
    { title: 'About Us', path: '/about' },
    { title: 'The All-Weather Portfolio', path: '/portfolios/all-weather' },
    { title: 'Dividend Growth Portfolio', path: '/portfolios/dividend-growth' },
    { title: 'Boglehead 3-Fund Portfolio', path: '/portfolios/boglehead' }
  ];

  const searchIndex = [
    ...staticIndex,
    ...sanityArticles.map(article => ({
      title: article.title,
      path: `/articles/${article.slug.current}`
    }))
  ];

  const results = searchQuery.length > 1 
    ? searchIndex.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node);
      if (isOutsideDesktop && isOutsideMobile) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f7f5]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <span className="text-[#f8f7f5] font-bold text-xl">A</span>
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight hidden lg:block">Arthanomy</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-6 text-base font-medium mr-4">
            <Link to="/learning" className={`${theme.textHover} transition-colors`}>Learning</Link>
            <Link to="/articles" className={`${theme.textHover} transition-colors`}>Articles</Link>
            <Link to="/portfolios" className={`${theme.textHover} transition-colors`}>Portfolios</Link>
            <Link to="/about" className={`${theme.textHover} transition-colors`}>About</Link>
          </div>
          <div className="relative w-64" ref={desktopSearchRef}>
            <div className={`flex items-center bg-white border rounded-full px-3 py-2 transition-all ${isSearchFocused ? 'border-black ring-1 ring-black' : 'border-black/10'}`}>
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search..." 
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-2 text-sm text-gray-900 w-full"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {isSearchFocused && (searchQuery.length > 1 || results.length > 0) && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {results.length > 0 ? (
                    results.map((result, idx) => (
                      <button 
                        key={idx}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex flex-col gap-0.5"
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery('');
                          navigate(result.path);
                        }}
                      >
                        <span className="font-medium text-gray-900 text-sm truncate">{result.title}</span>
                        <span className="text-[10px] text-gray-500 tracking-wider uppercase truncate">
                          {result.path === '/' ? 'Home' : result.path.replace('/', '')}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <a href="/#newsletter" className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors shrink-0">
            Subscribe
          </a>
        </div>
        <div className="flex md:hidden items-center gap-4">
          <div className="relative" ref={mobileSearchRef}>
            <button 
              onClick={() => setIsSearchFocused(!isSearchFocused)}
              className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            {isSearchFocused && (
              <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-black/5 p-2 z-50">
                <div className="flex items-center bg-gray-50 border border-black/10 rounded-lg px-2 py-1.5 mb-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Search..." 
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 px-2 text-sm text-gray-900 w-full"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                {searchQuery.length > 1 && (
                  <div className="max-h-64 overflow-y-auto">
                    {results.length > 0 ? (
                      results.map((result, idx) => (
                        <button 
                          key={idx}
                          className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded-md transition-colors flex flex-col gap-0.5"
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            navigate(result.path);
                          }}
                        >
                          <span className="font-medium text-gray-900 text-sm truncate">{result.title}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-2 py-3 text-center text-xs text-gray-500">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <button>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <span className="text-[#f8f7f5] font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">Arthanomy</span>
          </Link>
          <p className="text-gray-500 max-w-xs mb-6">
            Invest Smarter. Build Wealth. Live Free. A Canadian perspective on personal finance and investing.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Content</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li><Link to="/learning" className="hover:text-[#1a1a1a]">Learning</Link></li>
            <li><Link to="/articles" className="hover:text-[#1a1a1a]">Articles</Link></li>
            <li><Link to="/portfolios" className="hover:text-[#1a1a1a]">Portfolios</Link></li>
            <li><Link to="/about" className="hover:text-[#1a1a1a]">About</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li><Link to="/privacy" className="hover:text-[#1a1a1a]">Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className="hover:text-[#1a1a1a]">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-black/5 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Arthanomy. All rights reserved.</p>
        <p className="text-xs max-w-2xl text-center md:text-right">
          Arthanomy is for educational purposes only and does not provide personalized financial advice. 
          Always do your own research or consult a certified financial planner before making investment decisions.
        </p>
      </div>
    </footer>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme, currentThemeKey } = useTheme();
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-full shadow-2xl border border-black/5 flex gap-2">
      {(Object.keys(themes) as ThemeKey[]).map((key) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`w-8 h-8 rounded-full border-2 transition-transform ${currentThemeKey === key ? 'scale-110 border-black' : 'border-transparent hover:scale-105'}`}
          style={{ background: `linear-gradient(to right, ${themes[key].chartStroke}, ${themes[key].chartStroke}80)` }}
          title={themes[key].name}
        />
      ))}
    </div>
  );
}
