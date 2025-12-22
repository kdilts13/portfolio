'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

type Props = {
  markdown: string;
};

export default function Markdown({ markdown }: Props) {
  return (
    <div
      className="prose prose-invert max-w-none
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-ul:pl-6 prose-ol:pl-6
                    prose-li:my-1 prose-p:my-2"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          pre: ({ children, ...props }) => (
            <pre
              {...props}
              className="overflow-x-auto rounded-md border border-accent/30 bg-background p-3"
            >
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = typeof className === 'string' && className.includes('language-');

            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded bg-background px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
