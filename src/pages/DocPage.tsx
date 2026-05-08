import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

// Pre-load all markdown files in the pages directory
const mdFiles = import.meta.glob('./*/*.md', { query: '?raw', import: 'default' });

export default function DocPage({ pageId: propPageId }: { pageId?: string }) {
  const { lang = 'es', pageId: paramPageId } = useParams();
  const pageId = propPageId || paramPageId || 'index';
  
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(false);
      try {
        const loadFn = mdFiles[`./${lang}/${pageId}.md`];
        if (!loadFn) {
          throw new Error('Not found');
        }
        const text = await loadFn();
        setContent(text as string);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [pageId, lang]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-200 rounded col-span-2"></div>
            <div className="h-2 bg-gray-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-600">The documentation page you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-brand max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4 pb-2 border-b border-gray-200" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-medium text-gray-800 mt-8 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-600" {...props} />,
          li: ({node, ...props}) => <li className="" {...props} />,
          a: ({node, href, ...props}) => {
            // Automatically prepend the language prefix to internal root-relative links
            let targetHref = href;
            if (href?.startsWith('/') && !href.startsWith(`/${lang}/`) && href !== `/${lang}`) {
               // Need to handle root / vs /page
               targetHref = href === '/' ? `/${lang}` : `/${lang}${href}`;
            }
            return <a href={targetHref} className="text-brand-blue-600 hover:text-brand-blue-800 underline transition-colors" {...props} />;
          },
          code: ({node, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className?.includes('language-');
            
            // Render color swatch for hex colors if inline
            if (isInline && typeof children === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(children)) {
              return (
                <code className="bg-gray-100 text-brand-blue-700 px-1.5 py-0.5 rounded text-sm font-mono inline-flex items-center gap-1.5" {...props}>
                  <span 
                    className="inline-block w-3 h-3 rounded-sm border border-gray-300" 
                    style={{ backgroundColor: children }}
                    aria-hidden="true"
                  />
                  {children}
                </code>
              );
            }

            return isInline ? (
              <code className="bg-gray-100 text-brand-blue-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
          pre: ({node, ...props}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 text-sm font-mono" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-brand-cyan-500 bg-brand-cyan-50/50 pl-4 py-2 pr-4 italic text-gray-700 my-4 rounded-r-lg" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200" {...props} />,
          img: ({node, ...props}) => <img className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
