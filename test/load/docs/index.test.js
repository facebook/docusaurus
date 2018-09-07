import loadSetup from '../../loadSetup';

describe('loadDocs', () => {
  test('simple website', async () => {
    const props = await loadSetup('simple');
    expect(props).toMatchSnapshot();
  });

  test('versioned website', async () => {
    const props = await loadSetup('versioned');
    expect(props).toMatchSnapshot();
  });

  test('versioned & translated website', async () => {
    const props = await loadSetup('transversioned');
    expect(props).toMatchSnapshot();
  });

  test('translated website', async () => {
    const props = await loadSetup('translated');
    expect(props).toMatchSnapshot();
  });
});
