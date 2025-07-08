import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { rehypeJupyter, remarkJupyter } from "notebook-mdx";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [
      [remarkJupyter, { executeCode: false, showCellNumbers: true }],
    ],
    rehypePlugins: [[rehypeJupyter, { showCellNumbers: true }]],
  },
});
