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
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {error: null};
  }

  componentDidCatch(error: Error): void {
    // Catch errors in any components below and re-render with error message
    if (ExecutionEnvironment.canUseDOM) {
      this.setState({error});
    }
  }

  render(): ReactNode {
    const {children, fallback = Error} = this.props;
    const {error} = this.state;

    if (error) {
      fallback({
        error,
        tryAgain: () => this.setState({error: null}),
      });
    }

    // Normally, just render children
    return children;
  }
}

export default ErrorBoundary;
