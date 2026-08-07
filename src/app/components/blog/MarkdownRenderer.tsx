import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 mt-10 text-4xl font-bold text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-5 mt-10 text-3xl font-bold text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-4 mt-8 text-2xl font-semibold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-6 leading-8 text-gray-300">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 underline decoration-green-400/40 underline-offset-4 transition hover:text-green-300"
            >
              {children}
            </a>
          ),

          ul: ({ children }) => (
            <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-300">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-6 list-decimal space-y-2 pl-6 text-gray-300">
              {children}
            </ol>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-7 border-l-4 border-green-400 bg-green-400/5 px-6 py-4 italic text-gray-300">
              {children}
            </blockquote>
          ),

          code: ({ className, children, ...props }) => {
            const isBlockCode =
              className?.startsWith("language-");

            if (isBlockCode) {
              return (
                <code
                  className={className}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-green-300"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="my-7 overflow-x-auto rounded-2xl border border-white/10 bg-[#071411] p-5 text-sm">
              {children}
            </pre>
          ),

          table: ({ children }) => (
            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border border-white/10 px-4 py-3 text-gray-300">
              {children}
            </td>
          ),

          hr: () => (
            <hr className="my-10 border-white/10" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}