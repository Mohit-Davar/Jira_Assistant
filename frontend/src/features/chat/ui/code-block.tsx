import type { Components } from 'react-markdown';

import { atomOneDark, SyntaxHighlighter } from '@/features/chat/lib/syntax-highlighter';

type CodeProps = NonNullable<Components['code']>;

export const CodeBlock: CodeProps = ({ children, className, ...rest }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children ?? '').replace(/\n$/, '');

  if (!match) {
    return (
      <code
        {...rest}
        className="bg-muted px-1.5 py-0.5 border rounded-md font-mono text-muted-foreground text-sm"
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-muted px-3 py-1.5 border-b font-mono text-muted-foreground text-xs">
        <span className="font-semibold">{match[1]}</span>
      </div>

      <SyntaxHighlighter
        PreTag="div"
        language={match[1]}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'var(--muted)',
          fontSize: '0.875rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            background: 'transparent',
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
