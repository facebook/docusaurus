import path from 'path';
import loadSidebars from '@lib/load/docs/sidebars';

describe('loadSidebars', () => {
  const fixtures = path.join(__dirname, '..', '__fixtures__');
  test('normal site with sidebars', () => {
    const env = {};
    const siteDir = path.join(fixtures, 'simple-site');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site without sidebars', () => {
    const env = {};
    const siteDir = path.join(fixtures, 'bad-site');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site with sidebars & versioned sidebars', () => {
    const env = {
      versioning: {
        enabled: true,
        versions: ['1.0.1', '1.0.0']
      }
    };
    const siteDir = path.join(fixtures, 'versioned-site');
    const result = loadSidebars({siteDir, env});
    expect(result).toMatchSnapshot();
  });

  test('site with missing versioned sidebars', () => {
    const env = {
      versioning: {
        enabled: true,
        versions: ['2.0.0']
      }
    };
    const siteDir = path.join(fixtures, 'versioned-site');
    expect(() => {
      loadSidebars({siteDir, env});
    }).toThrowErrorMatchingInlineSnapshot(
      `"Failed to load versioned_sidebars/version-2.0.0-sidebars.json. It does not exist."`
    );
  });
});
