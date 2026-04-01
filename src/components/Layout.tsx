import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTheme, themes, ThemeKey } from '../ThemeContext';

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
  return (
    <nav className="sticky top-0 z-50 bg-[#f8f7f5]/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <span className="text-[#f8f7f5] font-bold text-xl">A</span>
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight">Arthanomy</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-base font-medium">
          <Link to="/" className={`${theme.textHover} transition-colors`}>Articles</Link>
          <Link to="/" className={`${theme.textHover} transition-colors`}>Portfolios</Link>
          <Link to="/" className={`${theme.textHover} transition-colors`}>Markets</Link>
          <Link to="/" className={`${theme.textHover} transition-colors`}>About</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-base font-medium hover:bg-black transition-colors">
            Subscribe
          </button>
        </div>
        <button className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
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
            <li><Link to="/" className="hover:text-[#1a1a1a]">Articles</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Market Updates</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Portfolios</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Data & Charts</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li><Link to="/" className="hover:text-[#1a1a1a]">About</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Contact</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Advertise</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li><Link to="/" className="hover:text-[#1a1a1a]">Terms of Service</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Privacy Policy</Link></li>
            <li><Link to="/" className="hover:text-[#1a1a1a]">Disclaimer</Link></li>
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
