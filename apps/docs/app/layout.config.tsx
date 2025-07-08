import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="4" width="20" height="3" rx="1" fill="currentColor" />
          <rect
            x="2"
            y="9"
            width="20"
            height="8"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="2"
            y="19"
            width="20"
            height="1"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
        notebook-mdx
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      text: "Documentation",
      url: "/docs",
    },
    {
      text: "GitHub",
      url: "https://github.com/abhay-ramesh/notebook-mdx",
    },
  ],
  githubUrl: "https://github.com/abhay-ramesh/notebook-mdx",
};
