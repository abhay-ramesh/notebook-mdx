"use client";

// React components for rendering Jupyter notebook elements with authentic styling
import hljs from "highlight.js";
import React from "react";
import type { NotebookData, NotebookOutput } from "./types.js";

// Initialize highlight.js
if (typeof window !== "undefined") {
  // Configure highlight.js
  hljs.configure({
    ignoreUnescapedHTML: true,
    classPrefix: "hljs-",
  });
}

// Function to highlight code with language detection
const highlightCode = (code: string, language?: string | undefined): string => {
  if (typeof window === "undefined") {
    // Server-side: return plain code
    return code;
  }

  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    } else {
      // Auto-detect language
      const result = hljs.highlightAuto(code);
      return result.value;
    }
  } catch (error) {
    console.warn("Highlight.js error:", error);
    return code;
  }
};

// Map common language names to highlight.js language identifiers
const normalizeLanguage = (lang?: string): string | undefined => {
  if (!lang) return undefined;

  const languageMap: Record<string, string | undefined> = {
    python: "python",
    py: "python",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    bash: "bash",
    sh: "bash",
    shell: "bash",
    html: "html",
    css: "css",
    json: "json",
    sql: "sql",
    r: "r",
    julia: "julia",
    scala: "scala",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    php: "php",
    ruby: "ruby",
    go: "go",
    rust: "rust",
    swift: "swift",
    kotlin: "kotlin",
    dart: "dart",
    perl: "perl",
    lua: "lua",
    matlab: "matlab",
    octave: "octave",
    markdown: "markdown",
    md: "markdown",
    latex: "latex",
    tex: "latex",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    toml: "toml",
    ini: "ini",
    dockerfile: "dockerfile",
    makefile: "makefile",
    raw: undefined, // No highlighting for raw cells
  };

  return languageMap[lang.toLowerCase()] || lang.toLowerCase();
};

// Component for rendering output text with syntax highlighting
const OutputText: React.FC<{ content: string }> = ({ content }) => {
  const [highlightedContent, setHighlightedContent] =
    React.useState<string>(content);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const highlighted = highlightCode(content);
    setHighlightedContent(highlighted);
  }, [content]);

  return (
    <pre>
      {isClient ? (
        <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
      ) : (
        content
      )}
    </pre>
  );
};

interface NotebookCodeCellProps {
  source: string | string[];
  outputs?: NotebookOutput[];
  executionCount?: number | null;
  showLineNumbers?: boolean;
  language?: string;
}

// Helper function to render different types of output data
const renderOutputData = (output: NotebookOutput) => {
  // Handle different output types according to Jupyter protocol
  if (output.output_type === "stream") {
    const textContent = Array.isArray(output.text)
      ? output.text.join("")
      : output.text;
    return (
      <div className="jp-output-stream">
        <OutputText content={textContent} />
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
                  <OutputText content={textContent} />
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
  language,
}) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;
  const normalizedLanguage = normalizeLanguage(language);
  const [highlightedCode, setHighlightedCode] =
    React.useState<string>(sourceString);
  const [isClient, setIsClient] = React.useState(false);

  // Handle client-side highlighting after component mounts
  React.useEffect(() => {
    setIsClient(true);
    const highlighted = highlightCode(
      sourceString,
      normalizedLanguage || undefined
    );
    setHighlightedCode(highlighted);
  }, [sourceString, normalizedLanguage]);

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
                {isClient ? (
                  <code
                    className={
                      normalizedLanguage ? `language-${normalizedLanguage}` : ""
                    }
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  />
                ) : (
                  <code
                    className={
                      normalizedLanguage ? `language-${normalizedLanguage}` : ""
                    }
                  >
                    {sourceString}
                  </code>
                )}
              </pre>
              {language && (
                <div className="jp-language-indicator">{language}</div>
              )}
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
        {/* Input area with same structure as code cells */}
        <div className="jp-cell-input-wrapper">
          <div className="jp-cell-input-prompt">
            {/* Empty prompt area to maintain indentation alignment */}
          </div>
          <div className="jp-cell-input-area">
            <div className="jp-cell-input-content">
              <div className="jp-markdown-content">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<p>${parseMarkdown(sourceString)}</p>`,
                  }}
                />
              </div>
            </div>
          </div>
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

  // Extract language from notebook metadata
  const kernelLanguage =
    notebook.metadata?.kernelspec?.language ||
    notebook.metadata?.language_info?.name;

  // Function to detect cell-level language
  const detectCellLanguage = (
    cell: any,
    fallbackLanguage?: string
  ): string | undefined => {
    // 1. Check cell metadata for language override (VSCode format)
    if (cell.metadata?.vscode?.languageId) {
      const vscodeLang = cell.metadata.vscode.languageId;
      // Don't show language indicator for raw cells even if VSCode metadata is present
      if (cell.cell_type === "raw") {
        return "raw";
      }
      return vscodeLang;
    }

    // 2. Check other common metadata formats
    if (cell.metadata?.languageId) {
      return cell.metadata.languageId;
    }

    if (cell.metadata?.language) {
      return cell.metadata.language;
    }

    // 3. For raw cells, always show "raw"
    if (cell.cell_type === "raw") {
      return "raw";
    }

    // 4. Fall back to notebook kernel language for regular code cells
    if (cell.cell_type === "code") {
      return fallbackLanguage;
    }

    // 5. No language for markdown cells
    return undefined;
  };

  return (
    <>
      <NotebookStyles />
      <div className="jp-notebook">
        {notebook.cells.map((cell: any, index: number) => {
          if (cell.cell_type === "markdown") {
            return <NotebookMarkdownCell key={index} source={cell.source} />;
          } else if (cell.cell_type === "code") {
            const cellLanguage = detectCellLanguage(cell, kernelLanguage);
            return (
              <NotebookCodeCell
                key={index}
                source={cell.source}
                outputs={cell.outputs || []}
                executionCount={cell.execution_count}
                showLineNumbers={showCellNumbers}
                language={cellLanguage}
              />
            );
          } else if (cell.cell_type === "raw") {
            const cellLanguage = detectCellLanguage(cell, kernelLanguage);
            return (
              <NotebookCodeCell
                key={index}
                source={cell.source}
                outputs={[]}
                executionCount={null}
                showLineNumbers={showCellNumbers}
                language={cellLanguage}
              />
            );
          }
          return null;
        })}
      </div>
    </>
  );
};

// CSS styles embedded as a component
export const NotebookStyles: React.FC = () => {
  // Check if styles already exist in DOM before initial render
  const stylesExist =
    typeof window !== "undefined" &&
    document.getElementById("jupyter-notebook-styles") !== null;

  // Don't render if styles already exist
  if (stylesExist) {
    return null;
  }

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
        margin: 0 0 16px 0;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        position: relative;
        border-left: var(--jp-border-width) solid transparent;
        padding-left: var(--jp-cell-padding);
        transition: border-color 0.2s ease;
        /* Inherit text color from parent */
        color: inherit;
      }

      .jp-notebook-cell:hover {
        border-left-color: rgba(128, 128, 128, 0.3);
      }

      .jp-notebook-cell.jp-cell-selected {
        border-left-color: #66afe9;
        background: rgba(66, 175, 233, 0.02);
      }

      .jp-code-cell {
        position: relative;
        background: transparent;
        color: inherit;
      }

      .jp-markdown-cell {
        position: relative;
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

      /* Highlight.js theme - adaptive colors that work with light/dark themes */
      .hljs {
        color: inherit;
        background: transparent;
      }

      .hljs-comment,
      .hljs-quote {
        color: #6a737d;
        font-style: italic;
      }

      .hljs-doctag,
      .hljs-keyword,
      .hljs-formula {
        color: #d73a49;
        font-weight: bold;
      }

      .hljs-section,
      .hljs-name,
      .hljs-selector-tag,
      .hljs-deletion,
      .hljs-subst {
        color: #22863a;
      }

      .hljs-literal {
        color: #032f62;
      }

      .hljs-string,
      .hljs-regexp,
      .hljs-addition,
      .hljs-attribute,
      .hljs-meta-string {
        color: #032f62;
      }

      .hljs-built_in,
      .hljs-class .hljs-title {
        color: #6f42c1;
      }

      .hljs-attr,
      .hljs-variable,
      .hljs-template-variable,
      .hljs-type,
      .hljs-selector-class,
      .hljs-selector-attr,
      .hljs-selector-pseudo,
      .hljs-number {
        color: #005cc5;
      }

      .hljs-symbol,
      .hljs-bullet,
      .hljs-link,
      .hljs-meta,
      .hljs-selector-id,
      .hljs-title {
        color: #6f42c1;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: bold;
      }

      .hljs-link {
        text-decoration: underline;
      }

      /* Adjust colors for dark themes */
      @media (prefers-color-scheme: dark) {
        .hljs-comment,
        .hljs-quote {
          color: #8b949e;
        }

        .hljs-doctag,
        .hljs-keyword,
        .hljs-formula {
          color: #ff7b72;
        }

        .hljs-section,
        .hljs-name,
        .hljs-selector-tag,
        .hljs-deletion,
        .hljs-subst {
          color: #7ee787;
        }

        .hljs-literal {
          color: #79c0ff;
        }

        .hljs-string,
        .hljs-regexp,
        .hljs-addition,
        .hljs-attribute,
        .hljs-meta-string {
          color: #a5d6ff;
        }

        .hljs-built_in,
        .hljs-class .hljs-title {
          color: #d2a8ff;
        }

        .hljs-attr,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-type,
        .hljs-selector-class,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-number {
          color: #79c0ff;
        }

        .hljs-symbol,
        .hljs-bullet,
        .hljs-link,
        .hljs-meta,
        .hljs-selector-id,
        .hljs-title {
          color: #d2a8ff;
        }
      }

      /* Override any theme CSS that might add line-level styling while preserving highlight.js classes */
      .jp-code-source *:not(.hljs):not([class*="hljs-"]),
      .jp-code-source > *:not(.hljs):not([class*="hljs-"]),
      .jp-code-source span:not([class*="hljs-"]),
      .jp-code-source div:not([class*="hljs-"]),
      .jp-code-source .line:not([class*="hljs-"]),
      .jp-code-source .token:not([class*="hljs-"]) {
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
        color: inherit;
      }

      .jp-cell-input-area:focus-within {
        border-color: rgba(102, 175, 233, 0.5);
      }

      .jp-cell-input-content {
        padding: 4px 8px;
        overflow: visible;
        background: transparent;
        color: inherit;
        position: relative;
      }

      /* Language indicator in bottom right */
      .jp-language-indicator {
        position: absolute;
        bottom: 4px;
        right: 8px;
        font-size: 10px;
        font-family: var(--jp-ui-font-family);
        color: rgba(128, 128, 128, 0.7);
        background: rgba(128, 128, 128, 0.1);
        padding: 2px 6px;
        border-radius: 2px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        pointer-events: none;
        user-select: none;
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
  NotebookLoader,
  NotebookStyles,
};
