import path from 'path';
import processMetadata from '@lib/load/docs/metadata';
import loadSetup from '../../loadSetup';

describe('processMetadata', () => {
  test('normal docs', async () => {
    const props = await loadSetup('simple');
    const {docsDir, env} = props;
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const dataA = await processMetadata(sourceA, docsDir, env, {});
    const dataB = await processMetadata(sourceB, docsDir, env, {});
    expect(dataA).toEqual({
      id: 'foo/bar',
      language: undefined,
      localized_id: 'foo/bar',
      permalink: 'docs/foo/bar',
      source: 'foo/bar.md',
      title: 'Bar',
      version: undefined
    });
    expect(dataB).toEqual({
      id: 'hello',
      language: undefined,
      localized_id: 'hello',
      permalink: 'docs/hello',
      source: 'hello.md',
      title: 'Hello, World !',
      version: undefined
    });
  });

  test('versioned docs (without translation)', async () => {
    const props = await loadSetup('versioned');
    const {siteDir, docsDir, env} = props;
    const refDir = path.join(siteDir, 'versioned_docs');
    const sourceA = path.join('version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('version-1.0.0', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {});
    const dataB = await processMetadata(sourceB, refDir, env, {});
    expect(dataA).toEqual({
      id: 'version-1.0.0-foo/bar',
      language: undefined,
      localized_id: 'version-1.0.0-foo/bar',
      permalink: 'docs/1.0.0/foo/bar',
      source: 'version-1.0.0/foo/bar.md',
      title: 'Bar',
      version: '1.0.0'
    });
    expect(dataB).toEqual({
      id: 'version-1.0.0-hello',
      language: undefined,
      localized_id: 'version-1.0.0-hello',
      permalink: 'docs/1.0.0/hello',
      source: 'version-1.0.0/hello.md',
      title: 'Hello, World !',
      version: '1.0.0'
    });
  });

  test('translated versioned docs', async () => {
    const props = await loadSetup('transversioned');
    const {siteDir, docsDir, env} = props;
    const refDir = path.join(siteDir, 'translated_docs');
    const sourceA = path.join('ko', 'version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'version-1.0.0', 'hello.md');
    const sourceC = path.join('ko', 'version-1.0.1', 'foo', 'bar.md');
    const sourceD = path.join('ko', 'version-1.0.1', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {});
    const dataB = await processMetadata(sourceB, refDir, env, {});
    const dataC = await processMetadata(sourceC, refDir, env, {});
    const dataD = await processMetadata(sourceD, refDir, env, {});
    expect(dataA).toEqual({
      id: 'ko-version-1.0.0-foo/bar',
      language: 'ko',
      localized_id: 'ko-version-1.0.0-foo/bar',
      permalink: 'docs/ko/1.0.0/foo/bar',
      source: 'ko/version-1.0.0/foo/bar.md',
      title: 'Bar',
      version: '1.0.0'
    });
    expect(dataB).toEqual({
      id: 'ko-version-1.0.0-hello',
      language: 'ko',
      localized_id: 'ko-version-1.0.0-hello',
      permalink: 'docs/ko/1.0.0/hello',
      source: 'ko/version-1.0.0/hello.md',
      title: 'Hello, World !',
      version: '1.0.0'
    });
    expect(dataC).toEqual({
      id: 'ko-version-1.0.1-foo/bar',
      language: 'ko',
      localized_id: 'ko-version-1.0.1-foo/bar',
      permalink: 'docs/ko/foo/bar',
      source: 'ko/version-1.0.1/foo/bar.md',
      title: 'Bar',
      version: '1.0.1'
    });
    expect(dataD).toEqual({
      id: 'ko-version-1.0.1-hello',
      language: 'ko',
      localized_id: 'ko-version-1.0.1-hello',
      permalink: 'docs/ko/hello',
      source: 'ko/version-1.0.1/hello.md',
      title: 'Hello, World !',
      version: '1.0.1'
    });
  });

  test('translated docs only', async () => {
    const props = await loadSetup('translated');
    const {siteDir, docsDir, env} = props;
    const refDir = path.join(siteDir, 'translated_docs');
    const sourceA = path.join('ko', 'foo', 'bar.md');
    const sourceB = path.join('ko', 'hello.md');
    const dataA = await processMetadata(sourceA, refDir, env, {});
    const dataB = await processMetadata(sourceB, refDir, env, {});
    expect(dataA).toEqual({
      id: 'ko-foo/bar',
      language: 'ko',
      localized_id: 'ko-foo/bar',
      permalink: 'docs/ko/foo/bar',
      source: 'ko/foo/bar.md',
      title: 'Bar',
      version: undefined
    });
    expect(dataB).toEqual({
      id: 'ko-hello',
      language: 'ko',
      localized_id: 'ko-hello',
      permalink: 'docs/ko/hello',
      source: 'ko/hello.md',
      title: 'Hello, World !',
      version: undefined
    });
  });
});
