import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import StudioPage from './pages/StudioPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="post/:slug" element={<ArticlePage />} />
          </Route>
          
          {/* Sanity Studio Route */}
          <Route path="/studio/*" element={<StudioPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}