import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-serif mb-8">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-serif mt-12 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-serif mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-muted mb-6">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="text-sm text-muted space-y-2 mb-6 list-disc list-inside">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-sm text-muted space-y-2 mb-6 list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border pl-4 my-6 text-sm text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-12" />,
  strong: ({ children }) => (
    <strong className="text-foreground font-medium">{children}</strong>
  ),
  em: ({ children }) => <em className="font-serif">{children}</em>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
