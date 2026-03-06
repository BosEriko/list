import React, { Fragment } from "react";
import Atom from "@atom";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownProps {
  content: string | null;
}

const components: Components = {
  img: ({ ...props }) => (
    <div className="relative flex items-center justify-center aspect-video w-full group my-25 scale-110">
      <div className="absolute rounded-md rotate-10 bg-[#f7b43d] w-full aspect-video opacity-70 transition-all duration-500 group-hover:rotate-3 scale-105 group-hover:scale-100 shadow-lg group-hover:shadow-md"></div>
      <div className="absolute rounded-md -rotate-6 bg-[#f7b43d] w-full aspect-video opacity-80 transition-all duration-500 group-hover:-rotate-2 scale-105 group-hover:scale-100 shadow-lg group-hover:shadow-md"></div>
      <div className="absolute rounded-md rotate-3 border-10 border-[#f7b43d] bg-cover bg-center w-full aspect-video overflow-hidden transition-all duration-500 group-hover:rotate-1 scale-110 group-hover:scale-100 shadow-lg group-hover:shadow-md">
        <img
          {...props}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  ),
  p: ({ children }) => (
    <div className="my-4 text-base leading-7 text-gray-800">{children}</div>
  ),
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold my-4 text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold my-3 text-gray-800">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-medium my-2 text-gray-700">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-medium my-1 text-gray-600">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-xl font-medium my-1 text-gray-600">{children}</h5>
  ),
  div: ({ className, children, ...props }) => {
    if (className?.includes("highlight__panel")) return null;
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  },
  pre: ({ children }) => {
    const codeElement = React.Children.only(
      children,
    ) as React.ReactElement<any>;
    const className: string = codeElement.props.className || "";
    const match = /language-(\w+)/.exec(className);

    return match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        className="my-4 rounded-lg overflow-x-auto"
      >
        {String(codeElement.props.children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <pre className="bg-gray-100 text-red-500 px-3 py-2 rounded my-4 overflow-x-auto">
        {codeElement.props.children}
      </pre>
    );
  },
  code: ({ children, className, ...props }) => {
    return (
      <code
        {...props}
        className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm font-mono"
      >
        {children}
      </code>
    );
  },
  ul: ({ children, className, ...props }) => {
    return (
      <ul {...props} className="list-disc list-outside space-y-1 ml-5">
        {children}
      </ul>
    );
  },
};

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <Fragment>
      <div className="p-5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </Fragment>
  );
};

export default Markdown;
