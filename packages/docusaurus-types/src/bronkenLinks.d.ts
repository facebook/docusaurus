export type BrokenLink = {
    link: string;
    resolvedLink: string;
    anchor: boolean;
  };
  
export type BrokenLinksMap = {
  [pathname: string]: BrokenLink[]
};