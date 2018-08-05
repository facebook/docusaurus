import React from 'react';
import MarkdownBlock from '../markdown';

class Blog extends React.Component {
  render() {
    const {content, siteConfig} = this.props;
    return <MarkdownBlock siteConfig={siteConfig}>{content}</MarkdownBlock>;
  }
}

module.exports = Blog;
