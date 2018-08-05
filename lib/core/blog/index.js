import React from 'react';
import MarkdownBlock from '../markdown';

class Docs extends React.Component {
  render() {
    const {content, siteConfig} = this.props;
    return <MarkdownBlock siteConfig={siteConfig}>{content}</MarkdownBlock>;
  }
}

module.exports = Docs;
