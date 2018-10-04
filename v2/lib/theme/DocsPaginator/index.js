import React from 'react';
import {Link} from 'react-router-dom';

export default class DocsPaginator extends React.Component {
  render() {
    const {docsMetadatas, metadata} = this.props;
    return (
      <div>
        {metadata.previous &&
          docsMetadatas[metadata.previous] && (
            <Link to={docsMetadatas[metadata.previous].permalink}>
              <span>← {metadata.previous_title}</span>
            </Link>
          )}
        {metadata.next &&
          docsMetadatas[metadata.next] && (
            <Link to={docsMetadatas[metadata.next].permalink}>
              <span>{metadata.next_title} →</span>
            </Link>
          )}
      </div>
    );
  }
}
