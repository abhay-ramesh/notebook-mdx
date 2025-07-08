import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center px-4">
      <h1 className="mb-4 text-4xl font-bold">notebook-mdx</h1>
      <p className="text-lg text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
        Render Jupyter notebooks in MDX with authentic styling, syntax
        highlighting, and full cell type support.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <Link
          href="/docs"
          className="bg-fd-primary text-fd-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-fd-primary/90 transition-colors"
        >
          Get Started
        </Link>

        <Link
          href="/docs/notebook-demo"
          className="border border-fd-border px-6 py-3 rounded-lg font-semibold hover:bg-fd-muted/50 transition-colors"
        >
          View Demo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-6 border border-fd-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">🎯 Authentic Styling</h3>
          <p className="text-fd-muted-foreground">
            Matches real Jupyter notebook appearance with proper colors, fonts,
            and spacing.
          </p>
        </div>

        <div className="p-6 border border-fd-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">🎨 Syntax Highlighting</h3>
          <p className="text-fd-muted-foreground">
            Full language support with Shiki for beautiful code highlighting.
          </p>
        </div>

        <div className="p-6 border border-fd-border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">📊 All Cell Types</h3>
          <p className="text-fd-muted-foreground">
            Code, markdown, and raw cells with outputs and execution counts.
          </p>
        </div>
      </div>
    </main>
  );
}
