export function getTopicColor(slug: string | undefined): string {
  if (!slug) return 'bg-gray-100 text-gray-800';
  
  // Using the middle of the gradients from the first four themes
  // Emerald, Blue, Violet, Amber, plus a few others for the remaining topics
  const colors: Record<string, string> = {
    'education': 'bg-emerald-100 text-emerald-800',
    'stocks-and-etfs': 'bg-blue-100 text-blue-800',
    'income-investing': 'bg-violet-100 text-violet-800',
    'portfolio-strategies': 'bg-amber-100 text-amber-800',
    'financial-freedom': 'bg-rose-100 text-rose-800',
    'economy': 'bg-slate-100 text-slate-800',
    'real-estate': 'bg-teal-100 text-teal-800',
    'tax-strategies': 'bg-cyan-100 text-cyan-800',
  };

  return colors[slug] || 'bg-gray-100 text-gray-800';
}
