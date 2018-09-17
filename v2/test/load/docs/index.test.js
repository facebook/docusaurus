import loadDocs from '@lib/load/docs';
import loadSetup from '../../loadSetup';

describe('loadDocs', () => {
  test('simple website', async () => {
    const props = await loadSetup('simple');
    const {siteDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas).toMatchSnapshot();
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    const {siteDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas).toMatchSnapshot();
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    const {siteDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas).toMatchSnapshot();
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    const {siteDir, docsDir, env, siteConfig} = props;
    const {docsMetadatas} = await loadDocs({siteDir, docsDir, env, siteConfig});
    expect(docsMetadatas).toMatchSnapshot();
  });
});
