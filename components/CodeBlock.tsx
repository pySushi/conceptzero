"use client";
import { useState } from 'react';

interface CodeBlockProps {
  node: React.ReactNode;
  inline: boolean;
  className?: string;
  children: string | string[];
}

// DefaultCodeBlock for non-inline code blocks (e.g. Python)
const DefaultCodeBlock = ({
  codeContent,
  ...props
}: { codeContent: string; [key: string]: any }) => {
  const [tab, setTab] = useState<'code' | 'run'>('code');
  const [output, setOutput] = useState<string | null>(null);
  return (
    <div className="not-prose flex flex-col">
      {tab === 'code' && (
        <pre
          {...props}
          className="text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900"
        >
          <code className="whitespace-pre-wrap break-words">
            {codeContent}
          </code>
        </pre>
      )}
      {tab === 'run' && output && (
        <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
          <code>{output}</code>
        </div>
      )}
      <div className="mt-2">
        <button
          onClick={() => setTab(tab === 'code' ? 'run' : 'code')}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded"
        >
          {tab === 'code' ? 'Run Code' : 'Show Code'}
        </button>
      </div>
    </div>
  );
};

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  // Extract language from className (e.g. language-mermaid)
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // Safely join children if an array.
  const codeContent = Array.isArray(children)
    ? children.join('')
    : String(children);

  if (inline) {
    return (
      <code
        className={`${className || ''} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {codeContent}
      </code>
    );
  }

  // Fallback for all other non-inline code blocks.
  return <DefaultCodeBlock codeContent={codeContent} {...props} />;
}