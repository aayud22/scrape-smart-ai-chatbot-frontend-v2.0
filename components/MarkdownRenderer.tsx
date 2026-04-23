import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        // Custom styling for Markdown elements using Tailwind CSS
        p: (props) => (
          <p className="mb-3 leading-relaxed text-muted-foreground/90" {...props} />
        ),
        strong: (props) => (
          <strong className="font-bold text-foreground" {...props} />
        ),
        ul: (props) => (
          <ul
            className="list-disc pl-6 mb-4 space-y-1 text-muted-foreground/90"
            {...props}
          />
        ),
        ol: (props) => (
          <ol
            className="list-decimal pl-6 mb-4 space-y-1 text-muted-foreground/90"
            {...props}
          />
        ),
        li: (props) => <li {...props} />,
        h1: (props) => (
          <h1
            className="text-xl font-black text-foreground mt-6 mb-3 uppercase tracking-tight"
            {...props}
          />
        ),
        h2: (props) => (
          <h2
            className="text-lg font-black text-foreground mt-5 mb-2 uppercase tracking-tight"
            {...props}
          />
        ),
        h3: (props) => (
          <h3
            className="text-base font-black text-foreground mt-4 mb-2 uppercase tracking-tight"
            {...props}
          />
        ),
        a: (props) => (
          <a
            className="text-primary hover:underline font-bold"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !className;
          return isInline ? (
            <code
              className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono font-bold border border-primary/20"
              {...props}
            >
              {children}
            </code>
          ) : (
            <div className="my-4 rounded-xl overflow-hidden bg-accent border border-border">
              <div className="flex items-center px-4 py-2 bg-background/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                {match ? match[1] : "code"}
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground/90">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
