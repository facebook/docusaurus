import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import usePluginData from '@docusaurus/usePluginData';
import Layout from '../Layout';
import './styles.css';

const NotFound = () => {
  const { siteConfig } = useDocusaurusContext();
  const { i18n } = usePluginData('i18n');

  return (
    <Layout>
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1>{i18n.translate('not_found.title')}</h1>
            <p>{i18n.translate('not_found.message')}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;