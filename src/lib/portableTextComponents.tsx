import { PortableTextComponents } from '@portabletext/react';
import { urlFor } from './sanity';

export const getPtComponents = (theme: any): PortableTextComponents => ({
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <img
            alt={value.alt || ' '}
            loading="lazy"
            src={urlFor(value).width(800).fit('max').auto('format').url()}
            className="rounded-2xl w-full"
          />
          {value.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{value.caption}</figcaption>}
        </figure>
      );
    },
    disclaimer: ({ value }: any) => {
      let bgColor = "bg-gray-100";
      let icon = "📌";
      
      if (value.style === 'disclaimer') {
        bgColor = "bg-red-50 border-l-4 border-red-500";
        icon = "⚠️";
      } else if (value.style === 'insight') {
        bgColor = "bg-blue-50 border-l-4 border-blue-500";
        icon = "💡";
      } else if (value.style === 'note') {
        bgColor = "bg-yellow-50 border-l-4 border-yellow-500";
        icon = "📌";
      }

      return (
        <div className={`p-4 my-6 rounded-r-lg flex gap-3 ${bgColor}`}>
          <span className="text-xl shrink-0">{icon}</span>
          <p className="m-0 text-gray-800 text-base">{value.text}</p>
        </div>
      );
    },
    table: ({ value }: any) => (
      <div className="table-wrapper overflow-x-auto my-8">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {value.rows?.map((row: any, rowIndex: number) => (
              <tr key={row._key || rowIndex} className={rowIndex === 0 ? 'bg-gray-100 font-semibold' : ''}>
                {row.cells?.map((cell: string, cellIndex: number) => (
                  rowIndex === 0
                    ? <th key={cellIndex} className="border border-gray-200 px-4 py-3 text-left text-gray-900">{cell}</th>
                    : <td key={cellIndex} className="border border-gray-200 px-4 py-3 text-gray-700">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    pullStat: ({ value }: any) => (
      <div className="pull-stat my-12 text-center p-8 bg-gray-50 rounded-3xl border border-black/5">
        <div className={`text-5xl md:text-6xl font-bold ${theme.textPrimary} mb-2`}>{value.value}</div>
        {value.label && <div className="text-lg font-medium text-gray-800 mt-2">{value.label}</div>}
        {value.subtext && <div className="text-sm text-gray-500 mt-2">{value.subtext}</div>}
      </div>
    ),
    arthTable: ({ value }: any) => {
      if (!value?.rows || value.rows.length === 0) return null;
      
      const [headerRow, ...bodyRows] = value.rows;
      
      return (
        <div className="table-wrapper overflow-x-auto my-10">
          <table className="w-full text-left border-collapse border-0">
            <thead className="bg-[#EEECE7] text-gray-900 border-0">
              <tr className="border-0">
                {headerRow.cells?.map((cell: string, cellIndex: number) => (
                  <th key={cellIndex} className="px-5 py-4 border-0 font-bold">
                    {cell.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border-0">
              {bodyRows.map((row: any, rowIndex: number) => (
                <tr key={row._key || rowIndex} className="transition-colors hover:bg-black/[0.02] border-0">
                  {row.cells?.map((cell: string, cellIndex: number) => (
                    <td 
                      key={cellIndex} 
                      className={`px-5 py-4 border-0 ${cellIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                    >
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      const rel = !value.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
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
});
