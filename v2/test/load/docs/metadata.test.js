import '@babel/polyfill';
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
      source: path.join(docsDir, sourceA),
      title: 'Bar',
      version: undefined,
    });
    expect(dataB).toEqual({
      id: 'hello',
      language: undefined,
      localized_id: 'hello',
      permalink: '/docs/hello',
      source: path.join(docsDir, sourceB),
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
      source: path.join(docsDir, source),
      title: 'Permalink',
      version: undefined,
    });
  });

  test('versioned docs (without translation)', async () => {
    const props = await loadSetup('versioned');
    const {siteDir, docsDir, env, siteConfig} = props;
    const versionedDir = path.join(siteDir, 'versioned_docs');
    const sourceA = path.join('version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('version-1.0.0', 'hello.md');
    const sourceC = path.join('foo', 'bar.md');
    const sourceD = path.join('hello.md');
    const dataA = await processMetadata(
      sourceA,
      versionedDir,
      env,
      {},
      siteConfig,
    );
    const dataB = await processMetadata(
      sourceB,
      versionedDir,
      env,
      {},
      siteConfig,
    );
    const dataC = await processMetadata(sourceC, docsDir, env, {}, siteConfig);
    const dataD = await processMetadata(sourceD, docsDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'version-1.0.0-foo/bar',
      language: undefined,
      localized_id: 'version-1.0.0-foo/bar',
      permalink: '/docs/1.0.0/foo/bar',
      source: path.join(versionedDir, sourceA),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(dataB).toEqual({
      id: 'version-1.0.0-hello',
      language: undefined,
      localized_id: 'version-1.0.0-hello',
      permalink: '/docs/1.0.0/hello',
      source: path.join(versionedDir, sourceB),
      title: 'Hello, World !',
      version: '1.0.0',
    });
    expect(dataC).toEqual({
      id: 'foo/bar',
      language: undefined,
      localized_id: 'foo/bar',
      permalink: '/docs/next/foo/bar',
      source: path.join(docsDir, sourceC),
      title: 'Bar',
      version: 'next',
    });
    expect(dataD).toEqual({
      id: 'hello',
      language: undefined,
      localized_id: 'hello',
      permalink: '/docs/next/hello',
      source: path.join(docsDir, sourceD),
      title: 'Hello, World !',
      version: 'next',
    });
  });

  test('translated versioned docs', async () => {
    const props = await loadSetup('transversioned');
    const {docsDir, translatedDir, versionedDir, env, siteConfig} = props;
    const sourceA = path.join('ko', 'version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'version-1.0.0', 'hello.md');
    const sourceC = path.join('ko', 'version-1.0.1', 'foo', 'bar.md');
    const sourceD = path.join('ko', 'version-1.0.1', 'hello.md');
    const sourceE = path.join('foo', 'bar.md');
    const sourceF = path.join('hello.md');
    const sourceG = path.join('version-1.0.0', 'foo', 'bar.md');
    const sourceH = path.join('version-1.0.0', 'hello.md');
    const dataA = await processMetadata(
      sourceA,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataB = await processMetadata(
      sourceB,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataC = await processMetadata(
      sourceC,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataD = await processMetadata(
      sourceD,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataE = await processMetadata(sourceE, docsDir, env, {}, siteConfig);
    const dataF = await processMetadata(sourceF, docsDir, env, {}, siteConfig);
    const dataG = await processMetadata(
      sourceG,
      versionedDir,
      env,
      {},
      siteConfig,
    );
    const dataH = await processMetadata(
      sourceH,
      versionedDir,
      env,
      {},
      siteConfig,
    );
    expect(dataA).toEqual({
      id: 'ko-version-1.0.0-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.0-foo/bar',
      permalink: '/docs/ko/1.0.0/foo/bar',
      source: path.join(translatedDir, sourceA),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(dataB).toEqual({
      id: 'ko-version-1.0.0-hello',
      language: 'ko',
      localized_id: 'version-1.0.0-hello',
      permalink: '/docs/ko/1.0.0/hello',
      source: path.join(translatedDir, sourceB),
      title: 'Hello, World !',
      version: '1.0.0',
    });
    expect(dataC).toEqual({
      id: 'ko-version-1.0.1-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.1-foo/bar',
      permalink: '/docs/ko/foo/bar',
      source: path.join(translatedDir, sourceC),
      title: 'Bar',
      version: '1.0.1',
    });
    expect(dataD).toEqual({
      id: 'ko-version-1.0.1-hello',
      language: 'ko',
      localized_id: 'version-1.0.1-hello',
      permalink: '/docs/ko/hello',
      source: path.join(translatedDir, sourceD),
      title: 'Hello, World !',
      version: '1.0.1',
    });
    expect(dataE).toEqual({
      id: 'en-foo/bar',
      language: 'en',
      localized_id: 'foo/bar',
      permalink: '/docs/en/next/foo/bar',
      source: path.join(docsDir, sourceE),
      title: 'Bar',
      version: 'next',
    });
    expect(dataF).toEqual({
      id: 'en-hello',
      language: 'en',
      localized_id: 'hello',
      permalink: '/docs/en/next/hello',
      source: path.join(docsDir, sourceF),
      title: 'Hello, World !',
      version: 'next',
    });
    expect(dataG).toEqual({
      id: 'en-version-1.0.0-foo/bar',
      language: 'en',
      localized_id: 'version-1.0.0-foo/bar',
      permalink: '/docs/en/1.0.0/foo/bar',
      source: path.join(versionedDir, sourceG),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(dataH).toEqual({
      id: 'en-version-1.0.0-hello',
      language: 'en',
      localized_id: 'version-1.0.0-hello',
      permalink: '/docs/en/1.0.0/hello',
      source: path.join(versionedDir, sourceH),
      title: 'Hello, World !',
      version: '1.0.0',
    });
  });

  test('translated docs only', async () => {
    const props = await loadSetup('translated');
    const {docsDir, translatedDir, env, siteConfig} = props;
    const sourceA = path.join('ko', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'hello.md');
    const sourceC = path.join('foo', 'bar.md');
    const sourceD = path.join('hello.md');
    const dataA = await processMetadata(
      sourceA,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataB = await processMetadata(
      sourceB,
      translatedDir,
      env,
      {},
      siteConfig,
    );
    const dataC = await processMetadata(sourceC, docsDir, env, {}, siteConfig);
    const dataD = await processMetadata(sourceD, docsDir, env, {}, siteConfig);
    expect(dataA).toEqual({
      id: 'ko-foo/bar',
      language: 'ko',
      localized_id: 'foo/bar',
      permalink: '/docs/ko/foo/bar',
      source: path.join(translatedDir, sourceA),
      title: 'Bar',
      version: undefined,
    });
    expect(dataB).toEqual({
      id: 'ko-hello',
      language: 'ko',
      localized_id: 'hello',
      permalink: '/docs/ko/hello',
      source: path.join(translatedDir, sourceB),
      title: 'Hello, World !',
      version: undefined,
    });
    expect(dataC).toEqual({
      id: 'en-foo/bar',
      language: 'en',
      localized_id: 'foo/bar',
      permalink: '/docs/en/foo/bar',
      source: path.join(docsDir, sourceC),
      title: 'Bar',
      version: undefined,
    });
    expect(dataD).toEqual({
      id: 'en-hello',
      language: 'en',
      localized_id: 'hello',
      permalink: '/docs/en/hello',
      source: path.join(docsDir, sourceD),
      title: 'Hello, World !',
      version: undefined,
    });
  });
});
