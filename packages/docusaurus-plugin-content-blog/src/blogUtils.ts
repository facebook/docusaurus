import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import {Feed} from 'feed';
import {PluginOptions, BlogPost, DateLink} from './types';
import {parse, normalizeUrl} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

export function truncate(fileString: string, truncateMarker: RegExp | string) {
  const truncated =
    typeof truncateMarker === 'string'
      ? fileString.includes(truncateMarker)
      : truncateMarker.test(fileString);
  return truncated ? fileString.split(truncateMarker)[0] : fileString;
}

// YYYY-MM-DD-{name}.mdx?
// prefer named capture, but old node version do not support
const FILENAME_PATTERN = /^(\d{4}-\d{1,2}-\d{1,2})-?(.*?).mdx?$/;

function toUrl({date, link}: DateLink) {
  return `${date
    .toISOString()
    .substring(0, '2019-01-01'.length)
    .replace(/-/g, '/')}/${link}`;
}

export async function generateBlogFeed(
  context: LoadContext,
  options: PluginOptions,
) {
  if (!options.feedOptions) {
    throw new Error(
      'Invalid options - `feedOptions` is not expected to be null.',
    );
  }
  const {siteDir, siteConfig} = context;
  const contentPath = path.resolve(siteDir, options.path);
  const blogPosts = await generateBlogPosts(contentPath, context, options);
  if (blogPosts == null) {
    return null;
  }

  const {feedOptions, routeBasePath} = options;
  const {url: siteUrl, title, favicon} = siteConfig;
  const blogBaseUrl = normalizeUrl([siteUrl, routeBasePath]);

  const updated =
    (blogPosts[0] && blogPosts[0].metadata.date) ||
    new Date('2015-10-25T16:29:00.000-07:00');

  const feed = new Feed({
    id: blogBaseUrl,
    title: feedOptions.title || `${title} Blog`,
    updated,
    language: feedOptions.language,
    link: blogBaseUrl,
    description: feedOptions.description || `${siteConfig.title} Blog`,
    favicon: normalizeUrl([siteUrl, favicon]),
    copyright: feedOptions.copyright,
  });

  blogPosts.forEach(post => {
    const {
      id,
      metadata: {title, permalink, date, description},
    } = post;
    feed.addItem({
      title,
      id: id,
      link: normalizeUrl([siteUrl, permalink]),
      date,
      description,
    });
  });

  return feed;
}

export async function generateBlogPosts(
  blogDir: string,
  {siteConfig, siteDir}: LoadContext,
  options: PluginOptions,
) {
  const {include, routeBasePath} = options;

  const dirExist = await fs.pathExists(blogDir);
  if (!dirExist) {
    return null;
  }

  const {baseUrl = ''} = siteConfig;
  const blogFiles = await globby(include, {
    cwd: blogDir,
  });

  const blogPosts: BlogPost[] = [];

  await Promise.all(
    blogFiles.map(async (relativeSource: string) => {
      // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
      const source = path.join(blogDir, relativeSource);
      const aliasedSource = `@site/${path.relative(siteDir, source)}`;
      const blogFileName = path.basename(relativeSource);

      const fileString = await fs.readFile(source, 'utf-8');
      const {frontMatter, excerpt} = parse(fileString);

      let date;
      // extract date and title from filename
      const match = blogFileName.match(FILENAME_PATTERN);
      let linkName = blogFileName.replace(/\.mdx?$/, '');
      if (match) {
        const [, dateString, name] = match;
        date = new Date(dateString);
        linkName = name;
      }
      // prefer usedefined date
      if (frontMatter.date) {
        date = new Date(frontMatter.date);
      }
      // use file create time for blog
      date = date || (await fs.stat(source)).birthtime;
      frontMatter.title = frontMatter.title || linkName;

      blogPosts.push({
        id: frontMatter.id || frontMatter.title,
        metadata: {
          permalink: normalizeUrl([
            baseUrl,
            routeBasePath,
            frontMatter.id || toUrl({date, link: linkName}),
          ]),
          source: aliasedSource,
          description: frontMatter.description || excerpt,
          date,
          tags: frontMatter.tags,
          title: frontMatter.title,
        },
      });
    }),
  );
  blogPosts.sort(
    (a, b) => b.metadata.date.getTime() - a.metadata.date.getTime(),
  );

  return blogPosts;
}
