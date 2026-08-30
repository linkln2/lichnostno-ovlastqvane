<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mobile-first-design-rules -->

# Mobile-first design

All UI must be designed for mobile first and then enhanced for larger screens.

- Default Tailwind classes target the smallest breakpoint (0 px). Use `sm:`, `md:`, `lg:`, and `xl:` to add desktop-only enhancements.
- Every page and component must be usable on a 360 px–wide viewport without horizontal scrolling.
- Navigation must provide a mobile affordance (bottom tab bar, hamburger drawer, or off-canvas menu) on screens below `md`.
- Touch targets must be at least 44 × 44 px.
- Tables and charts should scroll horizontally inside a container rather than overflow the viewport.
- Test visually with a mobile device or browser DevTools mobile emulation before committing.

<!-- END:mobile-first-design-rules -->
