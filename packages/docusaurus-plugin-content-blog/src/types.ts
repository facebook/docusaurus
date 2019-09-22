export interface BlogContent {
  blogPosts: BlogPost[];
  blogListPaginated: BlogPaginated[];
  blogTags: BlogTags;
  blogTagsListPath: string;
}

export interface DateLink {
  date: Date;
  link: string;
}

export interface PluginOptions {
  path: string;
  routeBasePath: string;
  include: string[];
  postsPerPage: number;
  blogListComponent: string;
  blogPostComponent: string;
  blogTagsListComponent: string;
  blogTagsPostsComponent: string;
  remarkPlugins: string[];
  rehypePlugins: string[];
  truncateMarker: RegExp | string;
}

export interface BlogTags {
  [key: string]: BlogTag;
}

export interface BlogTag {
  name: string;
  items: string[];
  permalink: string;
}

export interface BlogPost {
  id: string;
  metadata: MetaData;
}

export interface BlogPaginated {
  metadata: MetaData;
  items: string[];
}

export interface MetaData {
  permalink: string;
  source: string;
  description: string;
  date: Date;
  tags: (Tag | string)[];
  title: string;
}

export interface Tag {
  label: string;
  permalink: string;
}

export interface BlogItemsToModules {
  [key: string]: MetaDataWithPath;
}

export interface MetaDataWithPath {
  metadata: MetaData;
  metadataPath: string;
}

export interface TagsModule {
  [key: string]: TagModule;
}

export interface TagModule {
  allTagsPath: string;
  slug: string;
  name: string;
  count: number;
  permalink: string;
}
