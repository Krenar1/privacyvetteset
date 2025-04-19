import React from "react";

interface CodeViewerProps {
  code: string;
  language?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = "javascript"
}) => {
  return (
    <div className="relative rounded-md bg-muted overflow-hidden">
      <pre className="overflow-x-auto p-4 text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};