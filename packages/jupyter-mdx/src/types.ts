// Types based on official Jupyter notebook format and messaging protocol
// Reference: https://jupyter-client.readthedocs.io/en/stable/messaging.html

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
    name: string;
    version?: string;
    mimetype?: string;
    file_extension?: string;
  };
  [key: string]: any;
}

// Based on Jupyter messaging protocol output types
export interface StreamOutput {
  output_type: "stream";
  name: "stdout" | "stderr";
  text: string | string[];
}

export interface DisplayDataOutput {
  output_type: "display_data";
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ExecuteResultOutput {
  output_type: "execute_result";
  execution_count: number;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ErrorOutput {
  output_type: "error";
  ename: string;
  evalue: string;
  traceback: string[];
}

// Union type matching the Jupyter protocol exactly
export type NotebookOutput =
  | StreamOutput
  | DisplayDataOutput
  | ExecuteResultOutput
  | ErrorOutput;

export interface NotebookCell {
  cell_type: "code" | "markdown" | "raw";
  source: string | string[];
  metadata?: Record<string, any>;
  // For code cells only
  execution_count?: number | null;
  outputs?: NotebookOutput[];
}

export interface NotebookData {
  cells: NotebookCell[];
  metadata: NotebookMetadata;
  nbformat: number;
  nbformat_minor: number;
}
