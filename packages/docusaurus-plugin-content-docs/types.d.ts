declare module 'remark-admonitions' {
  type Options = any;

  const plugin: (options?: Options) => void;
  export = plugin;
}
