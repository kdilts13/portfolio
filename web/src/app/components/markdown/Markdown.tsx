'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

type Props = {
  markdown: string;
};

export default function Markdown({ markdown }: Props) {
  // Allow <br> tags produced by remark-breaks to survive sanitization.
  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'br'],
  } as any;

  return (
    <div
      className="prose prose-invert max-w-none
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-ul:pl-6 prose-ol:pl-6
                    prose-li:my-1 prose-p:my-2"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          code: ({ node, className, children, ...props }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <pre className="overflow-x-auto rounded-md border border-accent/30 bg-background p-3">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
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
