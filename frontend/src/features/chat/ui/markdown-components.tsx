import type { Components } from 'react-markdown';

import { CodeBlock } from '@/features/chat/ui/code-block';

export const markdownComponents: Components = {
  code: CodeBlock,

  p({ children }) {
    return <p className="mb-4 last:mb-0 text-foreground leading-7">{children}</p>;
  },

  ul({ children }) {
    return (
      <ul className="space-y-1 mb-4 ml-4 marker:text-muted-foreground list-disc">{children}</ul>
    );
  },

  ol({ children }) {
    return (
      <ol className="space-y-1 mb-4 ml-4 marker:text-muted-foreground list-decimal">
        {children}
      </ol>
    );
  },

  li({ children }) {
    return <li className="leading-7">{children}</li>;
  },

  h1({ children }) {
    return <h1 className="mt-6 mb-4 font-bold text-2xl tracking-tight">{children}</h1>;
  },

  h2({ children }) {
    return <h2 className="mt-5 mb-3 font-semibold text-xl tracking-tight">{children}</h2>;
  },

  h3({ children }) {
    return <h3 className="mt-4 mb-2 font-semibold text-lg">{children}</h3>;
  },

  h4({ children }) {
    return <h4 className="mt-3 mb-2 font-medium text-base">{children}</h4>;
  },

  h5({ children }) {
    return <h5 className="mt-3 mb-1 font-medium text-sm uppercase">{children}</h5>;
  },

  h6({ children }) {
    return <h6 className="mt-2 mb-1 text-muted-foreground text-xs uppercase">{children}</h6>;
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-4 pl-4 border-border border-l-4 text-muted-foreground italic">
        {children}
      </blockquote>
    );
  },

  table({ children }) {
    return (
      <div className="my-4 border rounded-lg overflow-x-auto">
        <table className="divide-border divide-y min-w-full text-sm">{children}</table>
      </div>
    );
  },

  thead({ children }) {
    return <thead className="bg-muted">{children}</thead>;
  },

  tbody({ children }) {
    return <tbody className="bg-transparent divide-border divide-y">{children}</tbody>;
  },

  tr({ children }) {
    return <tr className="transition-colors hover:bg-accent">{children}</tr>;
  },

  th({ children }) {
    return <th className="px-4 py-3 font-semibold text-foreground text-left">{children}</th>;
  },

  td({ children }) {
    return <td className="px-4 py-3 text-foreground">{children}</td>;
  },

  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary decoration-1 hover:underline underline-offset-2"
        {...props}
      >
        {children}
      </a>
    );
  },

  hr() {
    return <hr className="my-6 border-border" />;
  },

  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },

  em({ children }) {
    return <em className="text-foreground italic">{children}</em>;
  },

  del({ children }) {
    return <del className="text-muted-foreground line-through">{children}</del>;
  },

  pre({ children }) {
    return <>{children}</>;
  },

  img({ src, alt }) {
    return (
      <figure className="my-4">
        <img src={src ?? ''} alt={alt ?? ''} className="border rounded-lg max-w-full" />
        {alt && (
          <figcaption className="mt-2 text-muted-foreground text-xs text-center">{alt}</figcaption>
        )}
      </figure>
    );
  },

  input({ checked, type }) {
    if (type === 'checkbox') {
      return <input type="checkbox" checked={checked} readOnly className="mr-2 accent-primary" />;
    }
    return null;
  },

  kbd({ children }) {
    return (
      <kbd className="bg-muted px-1.5 py-0.5 border rounded text-xs">
        {children}
      </kbd>
    );
  },

  sup({ children }) {
    return <sup className="text-xs">{children}</sup>;
  },

  sub({ children }) {
    return <sub className="text-xs">{children}</sub>;
  },
};
