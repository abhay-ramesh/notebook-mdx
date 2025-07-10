"use client";

// React components for rendering Jupyter notebook elements with authentic styling
import hljs from "highlight.js";
import katex from "katex";
import React from "react";
import type { NotebookData, NotebookOutput } from "./types.js";
// Note: KaTeX CSS should be imported by the consumer application

// Note: plotly.js-dist-min doesn't have types, but it's the same API as plotly.js

// Initialize highlight.js immediately since we're using "use client"
hljs.configure({
  ignoreUnescapedHTML: true,
  classPrefix: "hljs-"
});

// Function to highlight code with language detection
const highlightCode = (code: string, language?: string | undefined): string => {
  // Since we're using "use client", this always runs on client
  // But hljs might not be ready immediately, so fallback gracefully
  if (!hljs || !hljs.highlight) {
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

// Copy Button Component
const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Failed to copy code:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="jp-copy-button"
      title={copied ? "Copied!" : "Copy code"}
      type="button"
    >
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="m5,15 0,-10 c0,-1.1 .9,-2 2,-2 l10,0" />
        </svg>
      )}
    </button>
  );
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
    raw: undefined // No highlighting for raw cells
  };

  return languageMap[lang.toLowerCase()] || lang.toLowerCase();
};

// Component for rendering output text with syntax highlighting
const OutputText: React.FC<{ content: string }> = ({ content }) => {
  // Use useMemo to compute highlighted content only when content changes
  const highlightedContent = React.useMemo(() => {
    return highlightCode(content);
  }, [content]);

  return (
    <pre>
      <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />
    </pre>
  );
};

// Component for rendering LaTeX mathematics
const LaTeXRenderer: React.FC<{ content: string }> = ({ content }) => {
  // Render LaTeX synchronously for instant display
  const renderLatex = React.useMemo(() => {
    try {
      // Remove display math delimiters and render
      const cleanLatex = content
        .replace(/^\$+|\$+$/g, "")
        .replace(/^\\displaystyle\s*/, "");

      const html = katex.renderToString(cleanLatex, {
        displayMode: true,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: false
      });

      return { html, error: null };
    } catch (err) {
      console.warn("LaTeX rendering error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "LaTeX rendering failed";
      return { html: "", error: errorMessage };
    }
  }, [content]);

  if (renderLatex.error) {
    return (
      <div className="notebook-output-latex-error">
        <pre
          style={{
            background: "#fff5f5",
            border: "1px solid #ff6b6b",
            borderRadius: "4px",
            padding: "10px",
            color: "#d63031"
          }}
        >
          {content}
        </pre>
        <small style={{ color: "#cc0000", display: "block", marginTop: "5px" }}>
          LaTeX Error: {renderLatex.error}
        </small>
      </div>
    );
  }

  return (
    <div
      className="notebook-output-latex"
      dangerouslySetInnerHTML={{ __html: renderLatex.html }}
      style={{
        margin: "1em 0",
        fontSize: "1.1em"
      }}
    />
  );
};

// Component for rendering Plotly charts using plotly.js-dist-min directly
const PlotlyRenderer: React.FC<{ data: any; config?: any; layout?: any }> = ({
  data,
  config = {},
  layout = {}
}) => {
  const plotRef = React.useRef<HTMLDivElement>(null);
  const [plotly, setPlotly] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  const [debugInfo, setDebugInfo] = React.useState<string>("Initializing...");

  // Ensure we're on the client side and DOM is ready
  React.useEffect(() => {
    console.log("🔍 PlotlyRenderer: Checking client environment");
    // Double-check we're in a browser environment
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      console.log("✅ PlotlyRenderer: Client environment detected");
      setIsClient(true);
      setDebugInfo("Client environment ready");
    } else {
      console.log("❌ PlotlyRenderer: Server-side environment");
      setDebugInfo("Server-side environment");
    }
  }, []);

  React.useEffect(() => {
    if (!isClient) {
      console.log("⏳ PlotlyRenderer: Waiting for client environment");
      return;
    }

    console.log("🚀 PlotlyRenderer: Starting Plotly loading process");
    setDebugInfo("Loading Plotly library...");

    const loadPlotlyDirect = async () => {
      try {
        console.log(
          "📦 PlotlyRenderer: Attempting to import plotly.js-dist-min"
        );

        // Add a small delay to ensure the DOM is fully ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check if we're really in a browser environment
        if (typeof window === "undefined" || typeof document === "undefined") {
          throw new Error("Browser environment not available");
        }

        console.log("🔄 PlotlyRenderer: Dynamic importing plotly.js-dist-min");
        setDebugInfo("Importing Plotly module...");

        // Try to import plotly.js-dist-min directly
        let Plotly: any;

        try {
          const plotlyModule = await import("plotly.js-dist-min" as any);
          console.log(
            "📦 PlotlyRenderer: Import successful, module keys:",
            Object.keys(plotlyModule || {})
          );

          Plotly = plotlyModule.default || plotlyModule;
          console.log("🔍 PlotlyRenderer: Plotly object type:", typeof Plotly);
          console.log(
            "🔍 PlotlyRenderer: Plotly has newPlot?",
            typeof Plotly?.newPlot
          );
        } catch (importErr: any) {
          console.error(
            "❌ PlotlyRenderer: Failed to import plotly.js-dist-min:",
            importErr
          );
          setDebugInfo(`Import failed: ${importErr?.message}`);
          throw new Error(
            `Could not load Plotly library: ${importErr?.message || "Unknown import error"}`
          );
        }

        // Validate that we got the Plotly object
        if (!Plotly) {
          console.error("❌ PlotlyRenderer: No Plotly object received");
          setDebugInfo("No Plotly object in module");
          throw new Error("plotly.js-dist-min did not provide a Plotly object");
        }

        if (typeof Plotly.newPlot !== "function") {
          console.error(
            "❌ PlotlyRenderer: Plotly.newPlot is not a function:",
            typeof Plotly.newPlot
          );
          console.error(
            "Available methods:",
            Object.keys(Plotly).filter(
              (key) => typeof Plotly[key] === "function"
            )
          );
          setDebugInfo("Plotly.newPlot not available");
          throw new Error(
            "plotly.js-dist-min did not provide a valid newPlot function"
          );
        }

        // Successfully loaded!
        console.log("✅ PlotlyRenderer: Plotly library loaded successfully");
        setPlotly(Plotly);
        setError(null);
        setDebugInfo("Plotly library ready");
      } catch (err: any) {
        console.error("❌ PlotlyRenderer: Failed to load Plotly:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Plotly library not available";
        setError(errorMessage);
        setDebugInfo(`Error: ${errorMessage}`);

        // For development, provide more details
        if (process.env.NODE_ENV === "development") {
          console.error("PlotlyRenderer loading error details:", {
            error: err,
            isClient,
            hasWindow: typeof window !== "undefined",
            hasDocument: typeof document !== "undefined"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlotlyDirect();
  }, [isClient]);

  // Create the plot when Plotly is loaded
  React.useEffect(() => {
    if (!plotly || !plotRef.current || !data) {
      console.log("⏳ PlotlyRenderer: Waiting for prerequisites", {
        hasPlotly: !!plotly,
        hasRef: !!plotRef.current,
        hasData: !!data
      });
      return;
    }

    console.log("🎨 PlotlyRenderer: Creating plot with data:", data);
    setDebugInfo("Creating chart...");

    const createPlot = async () => {
      try {
        const plotConfig = {
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
          responsive: true,
          ...config
        };

        const plotLayout = {
          autosize: true,
          margin: { t: 50, r: 30, b: 50, l: 50 },
          font: { size: 12 },
          ...layout,
          // Override width/height to ensure responsiveness
          width: undefined,
          height: undefined
        };

        console.log("📊 PlotlyRenderer: Calling newPlot with:", {
          element: plotRef.current,
          dataLength: Array.isArray(data) ? data.length : "not-array",
          layout: Object.keys(plotLayout),
          config: Object.keys(plotConfig)
        });

        await plotly.newPlot(plotRef.current, data, plotLayout, plotConfig);

        // Force a resize after plot creation to ensure proper fitting
        setTimeout(() => {
          if (plotly && plotRef.current) {
            plotly.Plots.resize(plotRef.current);
          }
        }, 100);

        console.log("✅ PlotlyRenderer: Chart rendered successfully");
        setDebugInfo("Chart rendered successfully");
      } catch (plotErr: any) {
        console.error("❌ PlotlyRenderer: Failed to create plot:", plotErr);
        const errorMessage =
          plotErr instanceof Error ? plotErr.message : "Failed to render chart";
        setError(errorMessage);
        setDebugInfo(`Render error: ${errorMessage}`);
      }
    };

    createPlot();
  }, [plotly, data, layout, config]);

  // Handle window resize to keep charts responsive
  React.useEffect(() => {
    if (!plotly || !plotRef.current) return;

    const handleResize = () => {
      if (plotly && plotRef.current) {
        plotly.Plots.resize(plotRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [plotly]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (plotly && plotRef.current) {
        try {
          console.log("🧹 PlotlyRenderer: Cleaning up chart");
          plotly.purge(plotRef.current);
        } catch (err) {
          console.warn("PlotlyRenderer cleanup error:", err);
        }
      }
    };
  }, [plotly]);

  // Show loading on server side and initial client render
  if (!isClient || loading) {
    return (
      <div className="notebook-output-plotly-loading">
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#666",
            border: "1px dashed #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9"
          }}
        >
          📊 Loading interactive chart...
          <br />
          <small>Plotly.js is loading</small>
          <br />
          <small style={{ color: "#999", fontSize: "11px" }}>{debugInfo}</small>
        </div>
      </div>
    );
  }

  if (error || !plotly) {
    return (
      <div className="notebook-output-plotly-error">
        <div
          style={{
            padding: "20px",
            border: "1px solid #ff9800",
            borderRadius: "4px",
            backgroundColor: "#fff3e0",
            color: "#e65100"
          }}
        >
          <strong>📊 Interactive Chart Unavailable</strong>
          <br />
          <small>{error || "Plotly library not available"}</small>
          <br />
          <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
            Debug: {debugInfo}
          </small>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer", color: "#1976d2" }}>
              View Raw Chart Data
            </summary>
            <pre
              style={{
                fontSize: "12px",
                overflow: "auto",
                maxHeight: "200px",
                background: "#f5f5f5",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginTop: "5px"
              }}
            >
              {JSON.stringify({ data, layout, config }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div
      className="notebook-output-plotly"
      style={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        margin: "10px 0",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: "#fff"
      }}
    >
      <div
        ref={plotRef}
        style={{
          width: "100%",
          height: "400px",
          minHeight: "300px",
          maxHeight: "600px",
          position: "relative"
        }}
      />
    </div>
  );
};

interface NotebookCodeCellProps {
  source: string | string[];
  outputs?: NotebookOutput[];
  executionCount?: number | null;
  showLineNumbers?: boolean;
  language?: string;
  showCopyButton?: boolean;
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
      "application/vnd.plotly.v1+json",
      "text/html",
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
      "text/markdown",
      "text/latex",
      "application/json",
      "text/plain"
    ];

    // Handle images first (highest visual priority)
    const imageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/svg+xml"
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
                  textAlign: "center"
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
                  margin: "0 auto"
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
            case "application/vnd.plotly.v1+json":
              try {
                const plotlyData = data[mimeType];
                elements.push(
                  <div key="plotly" className="notebook-output-plotly">
                    <PlotlyRenderer
                      data={plotlyData.data || []}
                      layout={plotlyData.layout || {}}
                      config={plotlyData.config || {}}
                    />
                  </div>
                );
              } catch (err) {
                console.warn("Error rendering Plotly data:", err);
                // Fallback to JSON display
                elements.push(
                  <div key="plotly-error" className="notebook-output-json">
                    <pre>Plotly Chart (rendering failed)</pre>
                    <details>
                      <summary>Raw Data</summary>
                      <pre>{JSON.stringify(data[mimeType], null, 2)}</pre>
                    </details>
                  </div>
                );
              }
              break;

            case "text/latex":
              const latexContent = Array.isArray(data[mimeType])
                ? data[mimeType].join("")
                : data[mimeType];
              elements.push(
                <div key="latex" className="notebook-output-latex">
                  <LaTeXRenderer content={latexContent} />
                </div>
              );
              break;

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
  showCopyButton = true
}) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;
  const normalizedLanguage = normalizeLanguage(language);

  // Use useMemo to compute highlighted code only when dependencies change
  const highlightedCode = React.useMemo(() => {
    return highlightCode(sourceString, normalizedLanguage || undefined);
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
                <code
                  className={
                    normalizedLanguage ? `language-${normalizedLanguage}` : ""
                  }
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  suppressHydrationWarning={true}
                />
              </pre>
              {showCopyButton && <CopyButton code={sourceString} />}
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
  source
}) => {
  const sourceString = Array.isArray(source) ? source.join("") : source;

  // Enhanced markdown parsing - memoized to avoid re-computation
  const parsedMarkdown = React.useMemo(() => {
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

    return parseMarkdown(sourceString);
  }, [sourceString]);

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
                    __html: `<p>${parsedMarkdown}</p>`
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
  notebookData?: NotebookData | string; // Allow both object and JSON string
  notebookDataJson?: string; // New prop for directive-based usage
  showCopyButton?: boolean;
}

// Function to detect cell-level language - moved outside component for better performance
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

export const NotebookLoader: React.FC<NotebookLoaderProps> = ({
  notebookPath,
  showCellNumbers = true,
  notebookData,
  notebookDataJson,
  showCopyButton = true,
  ...otherProps // Capture any other props that might be passed
}) => {
  // Parse notebook data synchronously during render to avoid hydration mismatch
  let notebook: NotebookData | null = null;
  let error: string | null = null;

  try {
    // Handle notebookDataJson prop (from remark plugin)
    if (notebookDataJson) {
      notebook = JSON.parse(notebookDataJson);
    }
    // Handle notebookData as JSON string
    else if (notebookData && typeof notebookData === "string") {
      notebook = JSON.parse(notebookData);
    }
    // Handle notebookData as object
    else if (notebookData && typeof notebookData === "object") {
      notebook = notebookData;
    }
    // No data provided
    else if (!notebookPath) {
      error = "No notebook path or data provided";
    }
    // File loading not implemented
    else {
      error =
        "Notebook loading from file system not implemented yet. Use notebookData prop instead.";
    }
  } catch (err) {
    error = `Failed to parse notebook JSON: ${err instanceof Error ? err.message : "Unknown error"}`;
  }

  if (error) {
    return (
      <div className="jp-notebook">
        <div
          style={{
            padding: "20px",
            color: "#d84315",
            border: "1px solid #ffcdd2",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 205, 210, 0.1)"
          }}
        >
          <strong>Error loading notebook:</strong> {error}
        </div>
      </div>
    );
  }

  if (!notebook || !notebook.cells || !Array.isArray(notebook.cells)) {
    return (
      <div className="jp-notebook">
        <div
          style={{
            padding: "20px",
            color: "#ff9800",
            border: "1px solid #ffcc02",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 204, 2, 0.1)"
          }}
        >
          <strong>Warning:</strong> No valid notebook data found or notebook has
          no cells.
        </div>
      </div>
    );
  }

  // Extract language from notebook metadata - memoized
  const kernelLanguage = React.useMemo(() => {
    return (
      notebook?.metadata?.kernelspec?.language ||
      notebook?.metadata?.language_info?.name
    );
  }, [notebook?.metadata]);

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
                showCopyButton={showCopyButton}
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
                showCopyButton={showCopyButton}
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
  // Always render the style element to ensure server/client match
  // Deduplication happens naturally via the id attribute
  return (
    <style id="jupyter-notebook-styles">{`
      /* Import KaTeX stylesheet */
        @import url('https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css');

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

      /* Copy button in top right */
      .jp-copy-button {
        position: absolute;
        top: 6px;
        right: 8px;
        width: 32px;
        height: 32px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        border-radius: 4px;
        background: rgba(128, 128, 128, 0.1);
        color: rgba(128, 128, 128, 0.8);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.2s ease;
        z-index: 10;
        font-size: 0;
        line-height: 0;
      }

      .jp-copy-button:hover {
        background: rgba(128, 128, 128, 0.2);
        border-color: rgba(128, 128, 128, 0.5);
        color: rgba(128, 128, 128, 1);
      }

      .jp-copy-button:focus {
        outline: 2px solid rgba(66, 175, 233, 0.5);
        outline-offset: 2px;
      }

      .jp-copy-button:active {
        transform: scale(0.95);
      }

      /* Show copy button on hover of the input area */
      .jp-cell-input-area:hover .jp-copy-button {
        opacity: 1;
      }

      /* Always show copy button on touch devices */
      @media (hover: none) and (pointer: coarse) {
        .jp-copy-button {
          opacity: 0.7;
        }
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

      /* LaTeX output */
      .notebook-output-latex {
        font-family: var(--jp-code-font-family);
        font-size: 1.1em;
        line-height: 1.6;
        color: inherit;
        background: transparent;
        text-align: center;
        margin: 1em 0;
      }

      .notebook-output-latex-error {
        color: #cc0000;
        font-family: var(--jp-code-font-family);
        font-size: 1em;
        line-height: 1.6;
        background: transparent;
        padding: 8px;
        border: 1px solid #ffcdd2;
        border-radius: 4px;
        margin: 1em 0;
      }

      /* Plotly output */
      .notebook-output-plotly {
        width: 100%;
        height: 400px;
        margin: 1em 0;
      }

      .notebook-output-plotly-error {
        color: #cc0000;
        font-family: var(--jp-code-font-family);
        font-size: 1em;
        line-height: 1.6;
        background: #fff5f5;
        padding: 20px;
        border: 1px solid #ffcdd2;
        border-radius: 4px;
        margin: 1em 0;
      }

      .notebook-output-plotly-loading {
        color: #666;
        font-family: var(--jp-ui-font-family);
        font-size: var(--jp-ui-font-size1);
        line-height: 1.5;
        padding: 20px;
        text-align: center;
        background: transparent;
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
  CopyButton
};

// Export interfaces
export type {
  NotebookCodeCellProps,
  NotebookLoaderProps,
  NotebookMarkdownCellProps
};
