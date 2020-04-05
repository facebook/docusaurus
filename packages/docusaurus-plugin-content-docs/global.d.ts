/// <reference types="node" />

// @mdx-js/mdx currently doesn't have any @types
declare module '@mdx-js/mdx' {
  export default function mdx(content: string, options: any): JSX.Element;
}
