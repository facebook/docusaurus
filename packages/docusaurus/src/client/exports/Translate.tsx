/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

// Can't read it from context, due to imperative API
import i18n from '@generated/i18n';

function getLocalizedText(text: string): string {
  return i18n.translations.pages[text];
}

// Imperative translation API is useful for some edge-cases:
// - translating page titles (meta)
// - translating string props (input placeholders, image alt, aria labels...)
export function translate(text: string): string {
  const localizedText = getLocalizedText(text);
  return localizedText ?? text;
}

export type TranslateProps = {
  children: string;
};
// Maybe we'll want to improve this component with additional features
// Like toggling a translation mode that adds a little translation button near the text?
export default function Translate({children}: TranslateProps): JSX.Element {
  const content: string = getLocalizedText(children) ?? children;
  return <>{content}</>;
}
