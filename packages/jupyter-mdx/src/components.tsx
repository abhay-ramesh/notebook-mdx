"use client";

// React components for rendering Jupyter notebook elements with authentic styling
import React from "react";
import type { NotebookData, NotebookOutput } from "./types.js";

interface NotebookCodeCellProps {
  source: string | string[];
  outputs?: NotebookOutput[];
  executionCount?: number | null;
  showLineNumbers?: boolean;
}

// Helper function to render different types of output data
const renderOutputData = (output: NotebookOutput) => {
  // Handle different output types according to Jupyter protocol
  if (output.output_type === "stream") {
    return (
      <div className="jp-output-stream">
        <pre>
          {Array.isArray(output.text) ? output.text.join("") : output.text}
        </pre>
      </div>
    );
  }

  if (output.output_type === "error") {
    return (
      <div className="jp-output-error">
        <div className="jp-output-error-name">
          {output.ename}: {output.evalue}
        </div>
        {output.traceback && (
          <pre className="jp-output-traceback">
            {output.traceback.join("\n")}
          </pre>
        )}
      </div>
    );
  }

  // For display_data and execute_result, handle MIME types with priority
  if (
    output.output_type === "display_data" ||
    output.output_type === "execute_result"
  ) {
    const data = output.data;
    if (!data) return null;

    const elements: React.ReactNode[] = [];

    // MIME type priority order matching Jupyter protocol
    const MIME_PRIORITY = [
      "text/html",
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
      "text/markdown",
      "text/latex",
      "application/json",
      "text/plain",
    ];

    // Handle images first (highest visual priority)
    const imageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/svg+xml",
    ];
    for (const imageType of imageTypes) {
      if (data[imageType]) {
        const imageData = data[imageType];
        const metadata = output.metadata?.[imageType];

        if (imageType === "image/svg+xml") {
          // SVG is stored as string, render directly
          const svgString = Array.isArray(imageData)
            ? imageData.join("")
            : imageData;
          elements.push(
            <div key={imageType} className="notebook-output-image">
              <div
                dangerouslySetInnerHTML={{ __html: svgString }}
                style={{
                  width: metadata?.width ? `${metadata.width}px` : undefined,
                  height: metadata?.height ? `${metadata.height}px` : undefined,
                  maxWidth: "100%",
                  textAlign: "center",
                }}
              />
            </div>
          );
        } else {
          // PNG, JPEG, GIF are base64-encoded
          const imageUrl = `data:${imageType};base64,${imageData}`;
          elements.push(
            <div key={imageType} className="notebook-output-image">
              <img
                src={imageUrl}
                alt="Notebook output"
                style={{
                  width: metadata?.width ? `${metadata.width}px` : undefined,
                  height: metadata?.height ? `${metadata.height}px` : undefined,
                  maxWidth: "100%",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          );
        }
        break; // Only render the first image type found
      }
    }

    // If no images, handle other MIME types in priority order
    if (elements.length === 0) {
      for (const mimeType of MIME_PRIORITY) {
        if (data[mimeType]) {
          switch (mimeType) {
            case "text/html":
              const htmlContent = Array.isArray(data[mimeType])
                ? data[mimeType].join("")
                : data[mimeType];
              elements.push(
                <div key="html" className="notebook-output-html">
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              );
              break;

            case "application/json":
              elements.push(
                <div key="json" className="notebook-output-json">
                  <pre>{JSON.stringify(data[mimeType], null, 2)}</pre>
                </div>
              );
              break;

            case "text/plain":
              const textContent = Array.isArray(data[mimeType])
                ? data[mimeType].join("")
                : data[mimeType];
              elements.push(
                <div key="text" className="notebook-output-text">
                  <pre>{textContent}</pre>
                </div>
              );
              break;

            default:
              // Handle other MIME types as text
              const content = Array.isArray(data[mimeType])
                ? data[mimeType].join("")
                : data[mimeType];
              elements.push(
                <div key={mimeType} className="notebook-output-text">
                  <pre>{content}</pre>
                </div>
              );
          }
          break; // Only render the first MIME type found in priority order
        }
      }
    }

    return elements.length > 0 ? <>{elements}</> : null;
  }

  return null;
};

const NotebookOutputComponent: React.FC<{
  output: NotebookOutput;
  index: number;
}> = ({ output, index }) => {
  const isExecuteResult = output.output_type === "execute_result";
  const isDisplayData = output.output_type === "display_data";
  const isStream = output.output_type === "stream";
  const isError = output.output_type === "error";

  return (
    <div className="jp-cell-output-wrapper">
      {/* Output prompt */}
      <div className="jp-cell-output-prompt">
        {isExecuteResult && (
          <div className="jp-output-prompt jp-output-execute-count">
            Out[{output.execution_count}]:
          </div>
        )}
      </div>

      {/* Output content */}
      <div className="jp-cell-output-area">
        <div className="jp-cell-output-content">{renderOutputData(output)}</div>
      </div>
    </div>
  );
};

export const NotebookCodeCell: React.FC<NotebookCodeCellProps> = ({
  source,
  outputs = [],
  executionCount,
  showLineNumbers = false,
}) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;

  return (
    <>
      <NotebookStyles />
      <div className="jp-notebook-cell jp-code-cell">
        {/* Input area */}
        <div className="jp-cell-input-wrapper">
          <div className="jp-cell-input-prompt">
            {executionCount ? (
              <div className="jp-input-prompt jp-input-execute-count">
                In [{executionCount}]:
              </div>
            ) : (
              <div className="jp-input-prompt">In [ ]:</div>
            )}
          </div>
          <div className="jp-cell-input-area">
            <div className="jp-cell-input-content">
              <pre className="jp-code-source">
                <code>{sourceString}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Output area */}
        {outputs.length > 0 && (
          <div className="jp-cell-outputs">
            {outputs.map((output, index) => (
              <NotebookOutputComponent
                key={index}
                output={output}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

interface NotebookMarkdownCellProps {
  source: string | string[];
}

export const NotebookMarkdownCell: React.FC<NotebookMarkdownCellProps> = ({
  source,
}) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;

  // Enhanced markdown parsing
  const parseMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/```([^`]+)```/gim, "<pre><code>$1</code></pre>")
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n\n/gim, "</p><p>")
      .replace(/\n/gim, "<br>");
  };

  return (
    <>
      <NotebookStyles />
      <div className="jp-notebook-cell jp-markdown-cell">
        <div className="jp-markdown-content">
          <div
            dangerouslySetInnerHTML={{
              __html: `<p>${parseMarkdown(sourceString)}</p>`,
            }}
          />
        </div>
      </div>
    </>
  );
};

interface NotebookRawCellProps {
  source: string | string[];
}

export const NotebookRawCell: React.FC<NotebookRawCellProps> = ({ source }) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;

  return (
    <>
      <NotebookStyles />
      <div className="jp-notebook-cell jp-raw-cell">
        <div className="jp-raw-content">
          <pre className="jp-raw-source">
            <code>{sourceString}</code>
          </pre>
        </div>
      </div>
    </>
  );
};

interface NotebookLoaderProps {
  notebookPath?: string;
  showCellNumbers?: boolean;
  notebookData?: NotebookData;
}

export const NotebookLoader: React.FC<NotebookLoaderProps> = ({
  notebookPath,
  showCellNumbers = true,
  notebookData,
}) => {
  const [notebook, setNotebook] = React.useState<NotebookData | null>(
    notebookData || null
  );
  const [loading, setLoading] = React.useState(!notebookData);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (notebookData) {
      setNotebook(notebookData);
      setLoading(false);
      return;
    }

    if (!notebookPath) {
      setError("No notebook path or data provided");
      setLoading(false);
      return;
    }

    // In a real implementation, you'd fetch the notebook file here
    // For now, we'll just show a placeholder
    setError(
      "Notebook loading from file system not implemented yet. Use notebookData prop instead."
    );
    setLoading(false);
  }, [notebookPath, notebookData]);

  if (loading) {
    return (
      <>
        <NotebookStyles />
        <div className="jp-notebook-loading">Loading notebook...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NotebookStyles />
        <div className="jp-notebook-error">Error: {error}</div>
      </>
    );
  }

  if (!notebook) {
    return (
      <>
        <NotebookStyles />
        <div className="jp-notebook-error">No notebook data available</div>
      </>
    );
  }

  return (
    <>
      <NotebookStyles />
      <div className="jp-notebook">
        {notebook.cells.map((cell: any, index: number) => {
          if (cell.cell_type === "markdown") {
            return <NotebookMarkdownCell key={index} source={cell.source} />;
          } else if (cell.cell_type === "code") {
            return (
              <NotebookCodeCell
                key={index}
                source={cell.source}
                outputs={cell.outputs || []}
                executionCount={cell.execution_count}
                showLineNumbers={showCellNumbers}
              />
            );
          } else if (cell.cell_type === "raw") {
            return <NotebookRawCell key={index} source={cell.source} />;
          }
          return null;
        })}
      </div>
    </>
  );
};

// Global flag to ensure styles are only rendered once
let stylesRendered = false;

// CSS styles embedded as a component
export const NotebookStyles: React.FC = () => {
  // Only render styles once per page load
  if (typeof window !== "undefined" && stylesRendered) {
    return null;
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      stylesRendered = true;
    }
  }, []);

  return (
    <style id="jupyter-notebook-styles">{`
      /* CSS Variables for authentic Jupyter theming */
      :root {
        --jp-border-width: 1px;
        --jp-border-radius: 3px;
        
        --jp-code-font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        --jp-code-font-size: 13px;
        --jp-code-line-height: 1.3077;
        
        --jp-ui-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        --jp-ui-font-size0: 11px;
        --jp-ui-font-size1: 13px;
        --jp-ui-font-size2: 14px;
        --jp-ui-font-size3: 16px;
        
        --jp-cell-padding: 5px;
        --jp-cell-prompt-width: 64px;
        --jp-cell-prompt-font-family: var(--jp-code-font-family);
        --jp-cell-prompt-font-size: var(--jp-code-font-size);
        --jp-cell-prompt-line-height: var(--jp-code-line-height);
        
        --jp-input-prompt-color: #307FC1;
        --jp-output-prompt-color: #D84315;
      }

      /* Main notebook container - inherit theme colors */
      .jp-notebook {
        font-family: var(--jp-ui-font-family);
        font-size: var(--jp-ui-font-size1);
        line-height: 1.5;
        padding: 0;
        margin: 0;
        max-width: none;
        border: none;
        box-shadow: none;
        /* Inherit colors from parent theme */
        color: inherit;
        background: transparent;
      }

      /* Individual cells - inherit theme colors */
      .jp-notebook-cell {
        display: block;
        margin: 0 0 6px 0;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        position: relative;
        border-left: var(--jp-border-width) solid transparent;
        padding-left: var(--jp-cell-padding);
        transition: border-color 0.1s ease;
        /* Inherit text color from parent */
        color: inherit;
      }

      .jp-notebook-cell:hover {
        border-left-color: currentColor;
        opacity: 0.3;
      }

      .jp-notebook-cell.jp-cell-selected {
        border-left-color: #66afe9;
        background: rgba(66, 175, 233, 0.02);
      }

      .jp-code-cell {
        position: relative;
        margin: 0;
        background: transparent;
        color: inherit;
      }

      .jp-markdown-cell {
        position: relative;
        margin: 0;
        background: transparent;
        color: inherit;
      }

      /* Cell input wrapper - inherit theme colors */
      .jp-cell-input-wrapper {
        display: flex;
        align-items: flex-start;
        background: transparent;
        margin: 0;
        padding: 0;
        color: inherit;
      }

      /* Input prompts - keep authentic Jupyter colors */
      .jp-cell-input-prompt {
        flex: 0 0 64px;
        color: inherit;
        opacity: 0.6;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        padding: 4px 8px 4px 0;
        text-align: right;
        user-select: none;
        min-height: 1.5em;
        vertical-align: top;
        background: transparent;
      }

      .jp-input-prompt {
        color: var(--jp-input-prompt-color);
        font-weight: bold;
        background: transparent;
      }

      /* Code source styling - treat as single message unit per protocol */
      .jp-code-source {
        margin: 0 !important;
        padding: 0 !important;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        white-space: pre-wrap;
        word-wrap: break-word;
        color: inherit;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        resize: none;
        overflow: visible;
        display: block;
        box-shadow: none !important;
      }

      /* Override any theme CSS that might add line-level styling */
      .jp-code-source *,
      .jp-code-source > *,
      .jp-code-source span,
      .jp-code-source div,
      .jp-code-source .line,
      .jp-code-source .token,
      .jp-code-source code {
        color: inherit !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
        font-family: inherit !important;
        font-size: inherit !important;
        line-height: inherit !important;
        white-space: inherit !important;
        word-wrap: inherit !important;
        display: inline !important;
        padding: 0 !important;
        margin: 0 !important;
        text-decoration: none !important;
      }

      /* Ensure code element displays as block container */
      .jp-code-source > code {
        display: block !important;
        width: 100% !important;
        height: auto !important;
      }

      /* Kill any syntax highlighting that adds borders */
      .jp-code-source .hljs,
      .jp-code-source .highlight,
      .jp-code-source .CodeMirror,
      .jp-code-source .cm-editor {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
      }

      /* Message-level styling only on container */
      .jp-cell-input-area {
        flex: 1;
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: var(--jp-border-radius);
        background: rgba(128, 128, 128, 0.05);
        position: relative;
        overflow: hidden; /* Prevent child elements from breaking out */
        transition: border-color 0.1s ease, background-color 0.1s ease;
        color: inherit;
      }

      .jp-cell-input-area:focus-within {
        border-color: #66afe9;
        box-shadow: 0 0 0 1px #66afe9;
      }

      .jp-cell-input-content {
        padding: 4px 8px;
        overflow: visible;
        background: transparent;
        color: inherit;
      }

      /* Markdown content - inherit theme colors */
      .jp-markdown-content {
        font-family: var(--jp-ui-font-family);
        font-size: var(--jp-ui-font-size2);
        line-height: 1.6;
        color: inherit;
        padding: 6px 12px;
        margin: 0;
        background: transparent;
        border: 1px solid transparent;
        border-radius: var(--jp-border-radius);
      }

      .jp-markdown-content h1,
      .jp-markdown-content h2,
      .jp-markdown-content h3,
      .jp-markdown-content h4,
      .jp-markdown-content h5,
      .jp-markdown-content h6 {
        color: inherit;
        background: transparent;
      }

      .jp-markdown-content h1 {
        font-size: 2em;
        margin: 0.67em 0;
        font-weight: bold;
      }

      .jp-markdown-content h2 {
        font-size: 1.5em;
        margin: 0.75em 0;
        font-weight: bold;
      }

      .jp-markdown-content h3 {
        font-size: 1.17em;
        margin: 0.83em 0;
        font-weight: bold;
      }

      .jp-markdown-content p {
        margin: 1em 0;
        color: inherit;
        background: transparent;
      }

      .jp-markdown-content code {
        background: rgba(128, 128, 128, 0.1);
        color: inherit;
        font-family: var(--jp-code-font-family);
        font-size: calc(var(--jp-code-font-size) - 1px);
        padding: 1px 4px;
        border-radius: 2px;
      }

      .jp-markdown-content pre {
        background: rgba(128, 128, 128, 0.05);
        color: inherit;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        padding: 8px 12px;
        border-radius: var(--jp-border-radius);
        overflow-x: auto;
        white-space: pre-wrap;
        margin: 1em 0;
      }

              /* Raw cell styling */
      .jp-raw-cell {
        position: relative;
        margin: 0;
        background: transparent;
        color: inherit;
      }

      .jp-raw-content {
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        color: inherit;
        padding: 6px 12px;
        margin: 0;
        background: rgba(128, 128, 128, 0.05);
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: var(--jp-border-radius);
        border-left: 4px solid #17a2b8;
      }

      .jp-raw-source {
        margin: 0 !important;
        padding: 0 !important;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: inherit;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        resize: none;
        overflow: visible;
        display: block;
        box-shadow: none !important;
      }

      .jp-raw-source code {
        color: inherit !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family: inherit !important;
        font-size: inherit !important;
        line-height: inherit !important;
        white-space: inherit !important;
        word-wrap: inherit !important;
        display: inline !important;
      }

      /* Cell outputs - inherit theme colors */
      .jp-cell-outputs {
        margin-top: 4px;
        background: transparent;
        color: inherit;
      }

      .jp-cell-output-wrapper {
        display: flex;
        align-items: flex-start;
        margin: 2px 0;
        background: transparent;
        color: inherit;
      }

      /* Output prompts - keep authentic Jupyter colors */
      .jp-cell-output-prompt {
        flex: 0 0 64px;
        color: inherit;
        opacity: 0.6;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        padding: 4px 8px 4px 0;
        text-align: right;
        user-select: none;
        min-height: 1.5em;
        vertical-align: top;
        background: transparent;
      }

      .jp-output-prompt {
        color: var(--jp-output-prompt-color);
        font-weight: bold;
        background: transparent;
      }

      /* Output area - subtle styling that adapts to theme */
      .jp-cell-output-area {
        flex: 1;
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: var(--jp-border-radius);
        background: transparent;
        overflow: hidden;
        position: relative;
        color: inherit;
      }

      .jp-cell-output-content {
        padding: 4px 8px;
        overflow-x: auto;
        background: transparent;
        color: inherit;
      }

      /* Stream output - inherit theme colors */
      .jp-output-stream pre {
        margin: 0;
        padding: 0;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        white-space: pre-wrap;
        word-wrap: break-word;
        color: inherit;
        background: transparent;
      }

      /* Error output - use red color but adapt to theme */
      .jp-output-error {
        color: #d32f2f;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        background: transparent;
      }

      .jp-output-error-name {
        font-weight: bold;
        margin-bottom: 4px;
        color: #d32f2f;
        background: transparent;
      }

      .jp-output-traceback {
        margin: 0;
        padding: 8px;
        background: rgba(211, 47, 47, 0.1);
        border: 1px solid rgba(211, 47, 47, 0.3);
        border-radius: var(--jp-border-radius);
        white-space: pre-wrap;
        overflow-x: auto;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        color: #d32f2f;
      }

      /* Image output */
      .notebook-output-image {
        text-align: center;
        margin: 4px 0;
        padding: 4px;
        background: transparent;
      }

      .notebook-output-image img {
        max-width: 100%;
        height: auto;
        border-radius: var(--jp-border-radius);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      /* Text output - inherit theme colors */
      .notebook-output-text pre {
        margin: 0;
        padding: 0;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        white-space: pre-wrap;
        word-wrap: break-word;
        color: inherit;
        background: transparent;
      }

      /* HTML output - inherit theme colors */
      .notebook-output-html {
        margin: 4px 0;
        font-family: var(--jp-ui-font-family);
        font-size: var(--jp-ui-font-size2);
        line-height: 1.6;
        color: inherit;
        background: transparent;
      }

      /* JSON output - subtle background that adapts to theme */
      .notebook-output-json pre {
        margin: 0;
        padding: 8px;
        font-family: var(--jp-code-font-family);
        font-size: var(--jp-code-font-size);
        line-height: var(--jp-code-line-height);
        background: rgba(128, 128, 128, 0.05);
        border: 1px solid rgba(128, 128, 128, 0.2);
        border-radius: var(--jp-border-radius);
        overflow-x: auto;
        white-space: pre-wrap;
        color: inherit;
      }

      /* Loading and error states - inherit theme colors */
      .jp-notebook-loading,
      .jp-notebook-error {
        padding: 16px;
        text-align: center;
        color: inherit;
        opacity: 0.6;
        font-style: italic;
        font-family: var(--jp-ui-font-family);
        font-size: var(--jp-ui-font-size1);
        background: transparent;
      }

      .jp-notebook-error {
        color: #d32f2f;
        background: rgba(211, 47, 47, 0.1);
        border: 1px solid rgba(211, 47, 47, 0.3);
        border-radius: var(--jp-border-radius);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .jp-notebook {
          font-size: var(--jp-ui-font-size0);
        }
        
        .jp-cell-input-prompt,
        .jp-cell-output-prompt {
          flex: 0 0 48px;
          font-size: calc(var(--jp-code-font-size) - 1px);
        }
      }

      /* Print styles */
      @media print {
        .jp-notebook {
          font-size: 11pt;
          color: #000000;
          background: #ffffff;
        }
        
        .jp-cell-input-prompt,
        .jp-cell-output-prompt {
          font-size: 10pt;
          color: #666666;
        }
        
        .jp-cell-input-area,
        .jp-cell-output-area {
          border: 1px solid #ccc;
          break-inside: avoid;
          background: #ffffff;
        }
        
        .jp-notebook-cell {
          break-inside: avoid;
          page-break-inside: avoid;
          color: #000000;
        }
      }
    `}</style>
  );
};

// Export components for use in MDX
export const JupyterComponents = {
  NotebookCodeCell,
  NotebookMarkdownCell,
  NotebookRawCell,
  NotebookLoader,
  NotebookStyles,
};
