import React, { createContext, useContext, useState } from 'react';

export const themes = {
  ocean: {
    name: 'Deep Ocean',
    gradientText: 'from-blue-600 to-teal-500',
    gradientBg: 'from-blue-50 to-teal-50',
    textPrimary: 'text-blue-600',
    textSecondary: 'text-teal-600',
    bgPrimary: 'bg-blue-600',
    bgLight: 'bg-blue-50',
    bgLightHover: 'hover:bg-blue-50',
    bgLighter: 'bg-blue-100',
    borderLight: 'border-blue-100',
    textHover: 'hover:text-blue-600',
    groupTextHover: 'group-hover:text-blue-600',
    groupBgHover: 'group-hover:bg-blue-50',
    selection: 'selection:bg-blue-200',
    chartStroke: '#2563eb',
    chartFill: 'url(#colorValueOcean)',
    newsletterBg1: 'bg-blue-900/40',
    newsletterBg2: 'bg-teal-900/40',
    newsletterText: 'text-blue-100',
  },
  sunset: {
    name: 'Sunset Coral',
    gradientText: 'from-rose-500 to-orange-400',
    gradientBg: 'from-rose-50 to-orange-50',
    textPrimary: 'text-rose-600',
    textSecondary: 'text-orange-500',
    bgPrimary: 'bg-rose-600',
    bgLight: 'bg-rose-50',
    bgLightHover: 'hover:bg-rose-50',
    bgLighter: 'bg-rose-100',
    borderLight: 'border-rose-100',
    textHover: 'hover:text-rose-600',
    groupTextHover: 'group-hover:text-rose-600',
    groupBgHover: 'group-hover:bg-rose-50',
    selection: 'selection:bg-rose-200',
    chartStroke: '#e11d48',
    chartFill: 'url(#colorValueSunset)',
    newsletterBg1: 'bg-rose-900/40',
    newsletterBg2: 'bg-orange-900/40',
    newsletterText: 'text-rose-100',
  },
  amethyst: {
    name: 'Royal Amethyst',
    gradientText: 'from-indigo-600 to-purple-500',
    gradientBg: 'from-indigo-50 to-purple-50',
    textPrimary: 'text-indigo-600',
    textSecondary: 'text-purple-500',
    bgPrimary: 'bg-indigo-600',
    bgLight: 'bg-indigo-50',
    bgLightHover: 'hover:bg-indigo-50',
    bgLighter: 'bg-indigo-100',
    borderLight: 'border-indigo-100',
    textHover: 'hover:text-indigo-600',
    groupTextHover: 'group-hover:text-indigo-600',
    groupBgHover: 'group-hover:bg-indigo-50',
    selection: 'selection:bg-indigo-200',
    chartStroke: '#4f46e5',
    chartFill: 'url(#colorValueAmethyst)',
    newsletterBg1: 'bg-indigo-900/40',
    newsletterBg2: 'bg-purple-900/40',
    newsletterText: 'text-indigo-100',
  },
  emerald: {
    name: 'Forest Mint',
    gradientText: 'from-emerald-600 to-teal-400',
    gradientBg: 'from-emerald-50 to-teal-50',
    textPrimary: 'text-emerald-600',
    textSecondary: 'text-teal-500',
    bgPrimary: 'bg-emerald-600',
    bgLight: 'bg-emerald-50',
    bgLightHover: 'hover:bg-emerald-50',
    bgLighter: 'bg-emerald-100',
    borderLight: 'border-emerald-100',
    textHover: 'hover:text-emerald-600',
    groupTextHover: 'group-hover:text-emerald-600',
    groupBgHover: 'group-hover:bg-emerald-50',
    selection: 'selection:bg-emerald-200',
    chartStroke: '#059669',
    chartFill: 'url(#colorValueEmerald)',
    newsletterBg1: 'bg-emerald-900/40',
    newsletterBg2: 'bg-teal-900/40',
    newsletterText: 'text-emerald-100',
  },
  monochrome: {
    name: 'Slate Blue',
    gradientText: 'from-slate-800 to-blue-600',
    gradientBg: 'from-slate-100 to-blue-50',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-blue-600',
    bgPrimary: 'bg-slate-800',
    bgLight: 'bg-slate-50',
    bgLightHover: 'hover:bg-slate-50',
    bgLighter: 'bg-slate-100',
    borderLight: 'border-slate-200',
    textHover: 'hover:text-slate-800',
    groupTextHover: 'group-hover:text-slate-800',
    groupBgHover: 'group-hover:bg-slate-50',
    selection: 'selection:bg-slate-200',
    chartStroke: '#1e293b',
    chartFill: 'url(#colorValueMonochrome)',
    newsletterBg1: 'bg-slate-800/40',
    newsletterBg2: 'bg-blue-900/40',
    newsletterText: 'text-slate-200',
  },
  gold: {
    name: 'Copper Gold',
    gradientText: 'from-[#E7AB8C] to-[#FCC359]',
    gradientBg: 'from-[#E7AB8C]/10 to-[#FCC359]/10',
    textPrimary: 'text-[#E7AB8C]',
    textSecondary: 'text-[#FCC359]',
    bgPrimary: 'bg-[#E7AB8C]',
    bgLight: 'bg-[#E7AB8C]/10',
    bgLightHover: 'hover:bg-[#E7AB8C]/20',
    bgLighter: 'bg-[#E7AB8C]/20',
    borderLight: 'border-[#E7AB8C]/20',
    textHover: 'hover:text-[#E7AB8C]',
    groupTextHover: 'group-hover:text-[#E7AB8C]',
    groupBgHover: 'group-hover:bg-[#E7AB8C]/10',
    selection: 'selection:bg-[#FCC359]/30',
    chartStroke: '#E7AB8C',
    chartFill: 'url(#colorValueGold)',
    newsletterBg1: 'bg-[#E7AB8C]/40',
    newsletterBg2: 'bg-[#FCC359]/40',
    newsletterText: 'text-orange-100',
  }
};

export type ThemeKey = keyof typeof themes;

interface ThemeContextType {
  theme: typeof themes[ThemeKey];
  setTheme: (key: ThemeKey) => void;
  currentThemeKey: ThemeKey;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeKey, setCurrentThemeKey] = useState<ThemeKey>('sunset');

  return (
    <ThemeContext.Provider value={{ theme: themes[currentThemeKey], setTheme: setCurrentThemeKey, currentThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
