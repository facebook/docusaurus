import path from 'path';
import processMetadata from '@lib/load/docs/metadata';
import loadSetup from '../../loadSetup';

describe('processMetadata', () => {
  test('normal docs', async () => {
    const props = await loadSetup('simple');
    const {docsDir, env, siteConfig} = props;
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const dataA = await processMetadata(sourceA, docsDir, env, {}, siteConfig);
    const dataB = await processMetadata(sourceB, docsDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'foo/bar',
      language: undefined,
      localized_id: 'foo/bar',
      permalink: '/docs/foo/bar',
      source: '@docs/foo/bar.md',
      title: 'Bar',
      version: undefined,
    });
    expect(dataB).toEqual({
      id: 'hello',
      language: undefined,
      localized_id: 'hello',
      permalink: '/docs/hello',
      source: '@docs/hello.md',
      title: 'Hello, World !',
      version: undefined,
    });
  });

  test('docs with custom permalink', async () => {
    const props = await loadSetup('simple');
    const {docsDir, env, siteConfig} = props;
    const source = path.join('permalink.md');
    const data = await processMetadata(source, docsDir, env, {}, siteConfig);
    expect(data).toEqual({
      id: 'permalink',
      language: undefined,
      localized_id: 'permalink',
      permalink: '/docs/endiliey/permalink',
      source: '@docs/permalink.md',
      title: 'Permalink',
      version: undefined,
    });
  });

  test('versioned docs (without translation)', async () => {
    const props = await loadSetup('versioned');
    const {siteDir, env, siteConfig} = props;
    const refDir = path.join(siteDir, 'versioned_docs');
    const sourceA = path.join('version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('version-1.0.0', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {}, siteConfig);
    const dataB = await processMetadata(sourceB, refDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'version-1.0.0-foo/bar',
      language: undefined,
      localized_id: 'version-1.0.0-foo/bar',
      permalink: '/docs/1.0.0/foo/bar',
      source: '@versioned_docs/version-1.0.0/foo/bar.md',
      title: 'Bar',
      version: '1.0.0',
    });
    expect(dataB).toEqual({
      id: 'version-1.0.0-hello',
      language: undefined,
      localized_id: 'version-1.0.0-hello',
      permalink: '/docs/1.0.0/hello',
      source: '@versioned_docs/version-1.0.0/hello.md',
      title: 'Hello, World !',
      version: '1.0.0',
    });
  });

  test('translated versioned docs', async () => {
    const props = await loadSetup('transversioned');
    const {siteDir, env, siteConfig} = props;
    const refDir = path.join(siteDir, 'translated_docs');
    const sourceA = path.join('ko', 'version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'version-1.0.0', 'hello.md');
    const sourceC = path.join('ko', 'version-1.0.1', 'foo', 'bar.md');
    const sourceD = path.join('ko', 'version-1.0.1', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {}, siteConfig);
    const dataB = await processMetadata(sourceB, refDir, env, {}, siteConfig);
    const dataC = await processMetadata(sourceC, refDir, env, {}, siteConfig);
    const dataD = await processMetadata(sourceD, refDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'ko-version-1.0.0-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.0-foo/bar',
      permalink: '/docs/ko/1.0.0/foo/bar',
      source: '@translated_docs/ko/version-1.0.0/foo/bar.md',
      title: 'Bar',
      version: '1.0.0',
    });
    expect(dataB).toEqual({
      id: 'ko-version-1.0.0-hello',
      language: 'ko',
      localized_id: 'version-1.0.0-hello',
      permalink: '/docs/ko/1.0.0/hello',
      source: '@translated_docs/ko/version-1.0.0/hello.md',
      title: 'Hello, World !',
      version: '1.0.0',
    });
    expect(dataC).toEqual({
      id: 'ko-version-1.0.1-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.1-foo/bar',
      permalink: '/docs/ko/foo/bar',
      source: '@translated_docs/ko/version-1.0.1/foo/bar.md',
      title: 'Bar',
      version: '1.0.1',
    });
    expect(dataD).toEqual({
      id: 'ko-version-1.0.1-hello',
      language: 'ko',
      localized_id: 'version-1.0.1-hello',
      permalink: '/docs/ko/hello',
      source: '@translated_docs/ko/version-1.0.1/hello.md',
      title: 'Hello, World !',
      version: '1.0.1',
    });
  });

  test('translated docs only', async () => {
    const props = await loadSetup('translated');
    const {siteDir, env, siteConfig} = props;
    const refDir = path.join(siteDir, 'translated_docs');
    const sourceA = path.join('ko', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {}, siteConfig);
    const dataB = await processMetadata(sourceB, refDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'ko-foo/bar',
      language: 'ko',
      localized_id: 'foo/bar',
      permalink: '/docs/ko/foo/bar',
      source: '@translated_docs/ko/foo/bar.md',
      title: 'Bar',
      version: undefined,
    });
    expect(dataB).toEqual({
      id: 'ko-hello',
      language: 'ko',
      localized_id: 'hello',
      permalink: '/docs/ko/hello',
      source: '@translated_docs/ko/hello.md',
      title: 'Hello, World !',
      version: undefined,
    });
  });
});
