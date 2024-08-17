import type { MDXComponents } from "mdx/types";

const genId = (props: any) => {
  if (props === undefined || props === "") return "";
  return props
    .toString()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 {...props} id={genId(props.children)} />,
    h2: (props) => <h2 {...props} id={genId(props.children)} />,
    h3: (props) => <h3 {...props} id={genId(props.children)} />,
    ...components,
  };
}
