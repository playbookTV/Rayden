import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";

export const useMDXComponents: typeof getDocsMDXComponents = (components) => {
  const docsComponents = getDocsMDXComponents(components);
  return {
    ...docsComponents,
    ...components,
  };
};
