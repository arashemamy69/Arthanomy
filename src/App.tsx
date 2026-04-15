import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import PostPage from './pages/PostPage';
import PortfoliosPage from './pages/PortfoliosPage';
import LearningPage from './pages/LearningPage';
import SeriesPage from './pages/SeriesPage';
import ArticlesPage from './pages/ArticlesPage';
import TopicPage from './pages/TopicPage';
import TagPage from './pages/TagPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import DisclaimerPage from './pages/DisclaimerPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="learning/:slug" element={<SeriesPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="topic/:slug" element={<TopicPage />} />
            <Route path="tag/:slug" element={<TagPage />} />
            <Route path="portfolios" element={<PortfoliosPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="disclaimer" element={<DisclaimerPage />} />
            <Route path="articles/:slug" element={<ArticlePage />} />
            <Route path="substack/:slug" element={<PostPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}