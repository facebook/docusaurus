/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Error from '@theme/Error';
import type {Props} from '@docusaurus/ErrorBoundary';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Catch errors in any components below and re-render with error message
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({
        error,
        errorInfo,
      });
    }
  }

  render(): ReactNode {
    const {children} = this.props;
    const {error, errorInfo} = this.state;

    if (error && errorInfo) {
      return <Error error={error} errorInfo={errorInfo} />;
    }

    // Normally, just render children
    return children;
  }
}

export default ErrorBoundary;
