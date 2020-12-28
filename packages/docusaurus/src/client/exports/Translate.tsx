/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

// Can't read it from context, due to exposing imperative API
import codeTranslations from '@generated/codeTranslations';

function getLocalizedMessage({
  id,
  message,
}: {
  message: string;
  id?: string;
}): string {
  return codeTranslations[id ?? message] ?? message;
}

export type TranslateParam = {
  message: string;
  id?: string;
  description?: string;
};
// Imperative translation API is useful for some edge-cases:
// - translating page titles (meta)
// - translating string props (input placeholders, image alt, aria labels...)
export function translate({message, id}: TranslateParam): string {
  const localizedMessage = getLocalizedMessage({message, id});
  return localizedMessage ?? message;
}

export type TranslateProps = {
  children: string;
  id?: string;
  description?: string;
};

// Maybe we'll want to improve this component with additional features
// Like toggling a translation mode that adds a little translation button near the text?
export default function Translate({children, id}: TranslateProps): JSX.Element {
  const localizedMessage: string =
    getLocalizedMessage({message: children, id}) ?? children;
  return <>{localizedMessage}</>;
}
