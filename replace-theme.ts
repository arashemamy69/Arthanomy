import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
content = content.replace(
  "import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';",
  "import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';\nimport { useTheme, themes, ThemeKey } from './ThemeContext';"
);

// App Component
content = content.replace(
  "export default function App() {\n  return (\n    <div className=\"min-h-screen bg-[#f8f7f5] text-[#1a1a1a] font-sans selection:bg-blue-200\">",
  "export default function App() {\n  const { theme } = useTheme();\n  return (\n    <div className={`min-h-screen bg-[#f8f7f5] text-[#1a1a1a] font-sans ${theme.selection}`}>"
);

content = content.replace(
  "      <Footer />\n    </div>",
  "      <Footer />\n      <ThemeSwitcher />\n    </div>"
);

// Navbar
content = content.replace(
  "function Navbar() {",
  "function Navbar() {\n  const { theme } = useTheme();"
);
content = content.replace(
  /className="hover:text-blue-600 transition-colors"/g,
  "className={`${theme.textHover} transition-colors`}"
);
content = content.replace(
  /className="text-sm font-medium hover:text-blue-600 transition-colors"/g,
  "className={`text-sm font-medium ${theme.textHover} transition-colors`}"
);

// Hero
content = content.replace(
  "function Hero() {",
  "function Hero() {\n  const { theme } = useTheme();"
);
content = content.replace(
  /className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"/g,
  "className={`bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent`}"
);
content = content.replace(
  /className="bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"/g,
  "className={`bg-gradient-to-r ${theme.gradientBg} ${theme.textPrimary} border ${theme.borderLight} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1`}"
);
content = content.replace(
  /className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0"/g,
  "className={`w-10 h-10 ${theme.bgLighter} ${theme.textPrimary} rounded-full flex items-center justify-center shrink-0`}"
);
content = content.replace(
  /className="text-xs text-teal-600"/g,
  "className={`text-xs ${theme.textSecondary}`}"
);

// Chart gradients
content = content.replace(
  /<stop offset="0%" stopColor="#2563eb" \/>/g,
  "<stop offset=\"0%\" stopColor={theme.chartStroke} />"
);
content = content.replace(
  /<stop offset="100%" stopColor="#14b8a6" \/>/g,
  "<stop offset=\"100%\" stopColor={theme.chartStroke} stopOpacity={0.5} />"
);
content = content.replace(
  /<stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}\/>/g,
  "<stop offset=\"5%\" stopColor={theme.chartStroke} stopOpacity={0.2}/>"
);
content = content.replace(
  /<stop offset="95%" stopColor="#14b8a6" stopOpacity={0}\/>/g,
  "<stop offset=\"95%\" stopColor={theme.chartStroke} stopOpacity={0}/>"
);

// SamplePortfolios
content = content.replace(
  "function SamplePortfolios() {",
  "function SamplePortfolios() {\n  const { theme } = useTheme();"
);
content = content.replace(
  /className="w-12 h-12 bg-\[#f8f7f5\] rounded-2xl flex items-center justify-center text-\[#1a1a1a\] mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"/g,
  "className={`w-12 h-12 bg-[#f8f7f5] rounded-2xl flex items-center justify-center text-[#1a1a1a] mb-6 ${theme.groupBgHover} ${theme.groupTextHover} transition-colors`}"
);
content = content.replace(
  /className="flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"/g,
  "className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary} opacity-0 group-hover:opacity-100 transition-opacity`}"
);

// LatestArticles
content = content.replace(
  "function LatestArticles() {",
  "function LatestArticles() {\n  const { theme } = useTheme();"
);
content = content.replace(
  /className="hidden md:flex items-center gap-2 font-medium hover:text-blue-600 transition-colors"/g,
  "className={`hidden md:flex items-center gap-2 font-medium ${theme.textHover} transition-colors`}"
);
content = content.replace(
  /className="text-xs font-bold uppercase tracking-wider text-blue-600"/g,
  "className={`text-xs font-bold uppercase tracking-wider ${theme.textPrimary}`}"
);
content = content.replace(
  /className="text-2xl font-bold leading-tight group-hover:text-blue-600 transition-colors"/g,
  "className={`text-2xl font-bold leading-tight ${theme.groupTextHover} transition-colors`}"
);

// Newsletter
content = content.replace(
  "function Newsletter() {",
  "function Newsletter() {\n  const { theme } = useTheme();"
);
content = content.replace(
  /className="absolute -top-\[50%\] -left-\[10%\] w-\[70%\] h-\[150%\] bg-blue-900\/40 rounded-full blur-3xl transform rotate-12"><\/div>/g,
  "className={`absolute -top-[50%] -left-[10%] w-[70%] h-[150%] ${theme.newsletterBg1} rounded-full blur-3xl transform rotate-12`}></div>"
);
content = content.replace(
  /className="absolute -bottom-\[50%\] -right-\[10%\] w-\[70%\] h-\[150%\] bg-teal-900\/40 rounded-full blur-3xl transform -rotate-12"><\/div>/g,
  "className={`absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] ${theme.newsletterBg2} rounded-full blur-3xl transform -rotate-12`}></div>"
);
content = content.replace(
  /className="text-lg text-blue-100 mb-10"/g,
  "className={`text-lg ${theme.newsletterText} mb-10`}"
);
content = content.replace(
  /className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"/g,
  "className={`bg-white text-slate-900 px-8 py-4 rounded-full font-bold ${theme.bgLightHover} transition-colors`}"
);

// Add ThemeSwitcher component
content += `
function ThemeSwitcher() {
  const { theme, setTheme, currentThemeKey } = useTheme();
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-full shadow-2xl border border-black/5 flex gap-2">
      {(Object.keys(themes) as ThemeKey[]).map((key) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={\`w-8 h-8 rounded-full border-2 transition-transform \${currentThemeKey === key ? 'scale-110 border-black' : 'border-transparent hover:scale-105'}\`}
          style={{ background: \`linear-gradient(to right, \${themes[key].chartStroke}, \${themes[key].chartStroke}80)\` }}
          title={themes[key].name}
        />
      ))}
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', content);
