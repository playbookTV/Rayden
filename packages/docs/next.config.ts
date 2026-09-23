import nextra from "nextra";

const withNextra = nextra({
  // Content directory defaults to 'content'
});

export default withNextra({
  reactStrictMode: true,
  // Allow release verification without replacing a running local docs build.
  distDir: process.env.RAYDEN_DOCS_DIST_DIR ?? ".next",
});
