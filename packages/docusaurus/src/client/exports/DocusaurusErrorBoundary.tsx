/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

import ExecutionEnvironment from './ExecutionEnvironment';
import Error from '@theme/Error';

interface Props {
  renderError?: any;
  tryAgain?: any;
  children: ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class DocusaurusErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({
        error,
        errorInfo,
      });
    }
  }

  render() {
    const {children, renderError, tryAgain} = this.props;
    const {error, errorInfo} = this.state;

    if (errorInfo) {
      // Let's output our error
      if (!renderError) {
        return (
          <Error error={error} errorInfo={errorInfo} tryAgain={tryAgain} />
        );
      }

      return renderError(error, errorInfo);
    }

    // Normally, just render children
    return children;
  }
}

export default DocusaurusErrorBoundary;
