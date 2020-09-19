/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {withRouter} from 'react-router-dom';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

interface Props {
  logError: boolean;
  showError: boolean;
}

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const {logError = false} = this.props;
    const {
      errorBoundary: {
        consoleHeading = 'An error occurred, here are the details.',
      } = {},
    } = siteConfig;

    // Catch errors in any components below and re-render with error message
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({
        error,
        errorInfo,
      });
    }

    // Log our errors to the console as well
    if (logError) {
      console.error(consoleHeading, error, errorInfo);
    }
  }

  render() {
    const {children, showError = false} = this.props;
    const {error, errorInfo} = this.state;
    const {
      errorBoundary: {
        heading = 'An error occurred, please contact the development team.',
      } = {},
    } = siteConfig;

    if (errorInfo) {
      // Let's output our error
      return (
        <div>
          <h2>{heading}</h2>
          {showError && (
            <details style={{whiteSpace: 'pre-wrap'}}>
              {error && error.toString()}
              <br />
              {errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    // Normally, just render children
    return children;
  }
}

export default withRouter(ErrorBoundary);
