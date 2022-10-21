/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps} from 'react';
import Translate from '@docusaurus/Translate';

export function ErrorBoundaryTryAgainButton(
  props: ComponentProps<'button'>,
): JSX.Element {
  return (
    <button type="button" {...props}>
      <Translate
        id="theme.ErrorPageContent.tryAgain"
        description="The label of the button to try again rendering when the React error boundary captures an error">
        Try again
      </Translate>
    </button>
  );
}
