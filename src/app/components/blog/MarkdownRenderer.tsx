import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {
  defaultSchema,
} from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "u",
  ],
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className", /^language-./],
    ],
  },
};

export default function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeSanitize,
            markdownSanitizeSchema,
          ],
          rehypeHighlight,
        ]}
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

          em: ({ children }) => (
            <em className="italic text-gray-300">
              {children}
            </em>
          ),

          del: ({ children }) => (
            <del className="text-gray-400 decoration-red-300/70">
              {children}
            </del>
          ),

          u: ({ children }) => (
            <u className="decoration-green-400/60 underline-offset-4">
              {children}
            </u>
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

          img: ({ src, alt }) => {
            if (
              !src ||
              typeof src !== "string"
            ) {
              return null;
            }

            return (
              <Image
                src={src}
                alt={alt ?? "Article image"}
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 800px, 100vw"
                className="my-8 h-auto w-full rounded-2xl border border-white/10 object-cover shadow-xl shadow-black/20"
              />
            );
          },

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
              className?.startsWith(
                "language-",
              );

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
