// TypeScript interfaces for Jupyter notebook support
export interface JupyterOptions {
  executeCode?: boolean;
  showCellNumbers?: boolean;
  showOutputPrompts?: boolean;
  theme?: "light" | "dark";
}

export interface NotebookMetadata {
  kernelspec?: {
    display_name: string;
    language: string;
    name: string;
  };
  language_info?: {
    codemirror_mode?: {
      name: string;
      version: number;
    };
    file_extension: string;
    mimetype: string;
    name: string;
    nbconvert_exporter: string;
    pygments_lexer: string;
    version: string;
  };
}

export interface NotebookOutput {
  output_type: "stream" | "display_data" | "execute_result" | "error";
  name?: "stdout" | "stderr"; // for stream outputs
  text?: string | string[]; // for stream outputs
  data?: {
    "text/plain"?: string | string[];
    "text/html"?: string | string[];
    "text/markdown"?: string | string[];
    "image/png"?: string; // base64-encoded image data
    "image/jpeg"?: string; // base64-encoded image data
    "image/svg+xml"?: string | string[]; // SVG as string
    "image/gif"?: string; // base64-encoded image data
    "application/json"?: any;
    "application/javascript"?: string | string[];
    [key: string]: any; // Allow other MIME types
  };
  metadata?: {
    "image/png"?: {
      width?: number;
      height?: number;
      [key: string]: any;
    };
    "image/jpeg"?: {
      width?: number;
      height?: number;
      [key: string]: any;
    };
    "image/svg+xml"?: {
      width?: number;
      height?: number;
      [key: string]: any;
    };
    "image/gif"?: {
      width?: number;
      height?: number;
      [key: string]: any;
    };
    [key: string]: any; // Allow other metadata
  };
  execution_count?: number | null; // for execute_result outputs
  ename?: string; // for error outputs
  evalue?: string; // for error outputs
  traceback?: string[]; // for error outputs
}

export interface NotebookCell {
  cell_type: "markdown" | "code" | "raw";
  metadata?: {
    collapsed?: boolean;
    autoscroll?: boolean | "auto";
    deletable?: boolean;
    format?: string; // MIME type for raw cells
    name?: string;
    tags?: string[];
    [key: string]: any;
  };
  source: string | string[];
  execution_count?: number | null; // for code cells
  outputs?: NotebookOutput[]; // for code cells
}

export interface NotebookData {
  nbformat: number;
  nbformat_minor: number;
  metadata: NotebookMetadata;
  cells: NotebookCell[];
}
