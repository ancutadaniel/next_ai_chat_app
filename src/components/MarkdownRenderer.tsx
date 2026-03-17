'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-[var(--studio-text-secondary)] hover:text-[var(--studio-text-primary)] transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre({ children }) {
          const codeElement = React.Children.toArray(children).find(
            (child): child is React.ReactElement<{ children?: React.ReactNode; className?: string }> =>
              React.isValidElement(child) && child.type === 'code'
          );

          let codeString = '';
          let language = '';

          if (codeElement) {
            const codeProps = codeElement.props as { children?: React.ReactNode; className?: string };
            codeString = extractTextFromChildren(codeProps.children);
            const className = codeProps.className || '';
            const match = className.match(/language-(\w+)/);
            language = match ? match[1] : '';
          }

          return (
            <div className="group relative my-4 rounded-lg border border-[var(--studio-border)] bg-[#0d0d0e] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--studio-border)] bg-[var(--studio-sidebar)]">
                <span className="text-xs text-[var(--studio-text-secondary)]">
                  {language || 'code'}
                </span>
                <CopyButton text={codeString} />
              </div>
              <div className="overflow-x-auto p-4">
                {children}
              </div>
            </div>
          );
        },
        code({ className, children, ...props }) {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="rounded bg-[var(--studio-sidebar)] px-1.5 py-0.5 text-sm text-[var(--studio-accent)]"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--studio-accent)] hover:underline"
            >
              {children}
            </a>
          );
        },
        table({ children }) {
          return (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-[var(--studio-border)]">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-[var(--studio-border)] bg-[var(--studio-sidebar)] px-4 py-2 text-left text-sm font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-[var(--studio-border)] px-4 py-2 text-sm">
              {children}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractTextFromChildren(props.children);
    }
  }
  return '';
}
