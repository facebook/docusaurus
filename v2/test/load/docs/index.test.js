import '@babel/polyfill';
import path from 'path';
import loadDocs from '@lib/load/docs';
import loadSetup from '../../loadSetup';

describe('loadDocs', () => {
  test('simple website', async () => {
    const props = await loadSetup('simple');
    const {siteDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas.hello).toEqual({
      category: 'Guides',
      id: 'hello',
      language: undefined,
      localized_id: 'hello',
      permalink: '/docs/hello',
      previous: 'foo/baz',
      previous_id: 'foo/baz',
      previous_title: 'baz',
      sidebar: 'docs',
      source: path.join(docsDir, 'hello.md'),
      title: 'Hello, World !',
      version: undefined,
    });
    expect(docsMetadatas['foo/bar']).toEqual({
      category: 'Test',
      id: 'foo/bar',
      language: undefined,
      localized_id: 'foo/bar',
      next: 'foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo', 'bar.md'),
      title: 'Bar',
      version: undefined,
    });
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    const {siteDir, docsDir, versionedDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas['version-1.0.0-foo/bar']).toEqual({
      category: 'Test',
      id: 'version-1.0.0-foo/bar',
      language: undefined,
      localized_id: 'version-1.0.0-foo/bar',
      next: 'version-1.0.0-foo/baz',
      next_id: 'version-1.0.0-foo/baz',
      next_title: 'Baz',
      permalink: '/docs/1.0.0/foo/bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(versionedDir, 'version-1.0.0/foo/bar.md'),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(docsMetadatas['foo/bar']).toEqual({
      category: 'Test',
      id: 'foo/bar',
      language: undefined,
      localized_id: 'foo/bar',
      next: 'foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/next/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo/bar.md'),
      title: 'Bar',
      version: 'next',
    });
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    const {
      siteDir,
      docsDir,
      env,
      translatedDir,
      versionedDir,
      siteConfig,
    } = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas['ko-version-1.0.0-foo/bar']).toEqual({
      category: 'Test',
      id: 'ko-version-1.0.0-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.0-foo/bar',
      next: 'ko-version-1.0.0-foo/baz',
      next_id: 'version-1.0.0-foo/baz',
      next_title: 'baz',
      permalink: '/docs/ko/1.0.0/foo/bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(translatedDir, '/ko/version-1.0.0/foo/bar.md'),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(docsMetadatas['en-version-1.0.0-foo/baz']).toEqual({
      category: 'Test',
      id: 'en-version-1.0.0-foo/baz',
      language: 'en',
      localized_id: 'version-1.0.0-foo/baz',
      next: 'en-version-1.0.0-hello',
      next_id: 'version-1.0.0-hello',
      next_title: 'Hello, World !',
      permalink: '/docs/en/1.0.0/foo/baz',
      previous: 'en-version-1.0.0-foo/bar',
      previous_id: 'version-1.0.0-foo/bar',
      previous_title: 'Bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(versionedDir, 'version-1.0.0/foo/baz.md'),
      title: 'Baz',
      version: '1.0.0',
    });
    expect(docsMetadatas['en-hello']).toEqual({
      category: 'Guides',
      id: 'en-hello',
      language: 'en',
      localized_id: 'hello',
      permalink: '/docs/en/next/hello',
      previous: 'en-foo/baz',
      previous_id: 'foo/baz',
      previous_title: 'baz',
      sidebar: 'docs',
      source: path.join(docsDir, 'hello.md'),
      title: 'Hello, World !',
      version: 'next',
    });
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    const {siteDir, translatedDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas['ko-foo/baz']).toEqual({
      category: 'Test',
      id: 'ko-foo/baz',
      language: 'ko',
      localized_id: 'foo/baz',
      next: 'ko-hello',
      next_id: 'hello',
      next_title: 'Hello, World !',
      permalink: '/docs/ko/foo/baz',
      previous: 'ko-foo/bar',
      previous_id: 'foo/bar',
      previous_title: 'Bar',
      sidebar: 'docs',
      source: path.join(translatedDir, 'ko', 'foo', 'baz.md'),
      title: 'baz',
      version: undefined,
    });
    expect(docsMetadatas['en-foo/bar']).toEqual({
      category: 'Test',
      id: 'en-foo/bar',
      language: 'en',
      localized_id: 'foo/bar',
      next: 'en-foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/en/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo', 'bar.md'),
      title: 'Bar',
      version: undefined,
    });
  });
});
