import '@babel/polyfill';
import createSitemap from '@lib/core/sitemap';
import loadSetup from '../loadSetup';

describe('sitemap', () => {
  test('simple site', async () => {
    const props = await loadSetup('simple');
    const sitemap = await createSitemap(props);
    expect(sitemap).toMatchSnapshot();
  });

  test('translated site', async () => {
    const props = await loadSetup('translated');
    const sitemap = await createSitemap(props);
    expect(sitemap).toMatchSnapshot();
  });

  test('versioned site', async () => {
    const props = await loadSetup('versioned');
    const sitemap = await createSitemap(props);
    expect(sitemap).toMatchSnapshot();
  });

  test('translated + versioned site', async () => {
    const props = await loadSetup('transversioned');
    const sitemap = await createSitemap(props);
    expect(sitemap).toMatchSnapshot();
  });

  test('empty site', async () => {
    const props = await loadSetup('empty');
    expect(createSitemap(props)).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Url in siteConfig.js cannot be empty/undefined"`,
    );
  });
});
