import { describe, expect, it } from "vitest";
import type {
  NotebookCell,
  NotebookMetadata,
  NotebookOutput
} from "./types.js";

describe("Types", () => {
  it("should define NotebookCell type correctly", () => {
    const cell: NotebookCell = {
      cell_type: "code",
      source: ['print("Hello World")'],
      metadata: {},
      execution_count: 1,
      outputs: []
    };

    expect(cell.cell_type).toBe("code");
    expect(cell.source).toEqual(['print("Hello World")']);
    expect(cell.execution_count).toBe(1);
  });

  it("should define NotebookOutput type correctly", () => {
    const output: NotebookOutput = {
      output_type: "stream",
      name: "stdout",
      text: ["Hello World\n"]
    };

    expect(output.output_type).toBe("stream");
    expect(output.name).toBe("stdout");
    expect(output.text).toEqual(["Hello World\n"]);
  });

  it("should define NotebookMetadata type correctly", () => {
    const metadata: NotebookMetadata = {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        name: "python",
        version: "3.8.0"
      }
    };

    expect(metadata.kernelspec?.display_name).toBe("Python 3");
    expect(metadata.language_info?.name).toBe("python");
  });
});
