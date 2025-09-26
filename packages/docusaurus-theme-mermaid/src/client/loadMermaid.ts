/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Mermaid} from 'mermaid';

declare global {
  // Global variable provided by bundler DefinePlugin
  /* eslint-disable-next-line no-underscore-dangle */
  const __DOCUSAURUS_MERMAID_LAYOUT_ELK_ENABLED__: boolean;
}

async function loadMermaidAndRegisterLayouts(): Promise<Mermaid> {
  const mermaid = (await import('mermaid')).default;

  // Mermaid does not support ELK layouts by default
  // See https://github.com/mermaid-js/mermaid/tree/develop/packages/mermaid-layout-elk
  // ELK layouts are heavy, so we made it an optional peer dependency
  // See https://github.com/facebook/docusaurus/pull/11357
  if (__DOCUSAURUS_MERMAID_LAYOUT_ELK_ENABLED__) {
    const elkLayout = (await import('@mermaid-js/layout-elk')).default;
    mermaid.registerLayoutLoaders(elkLayout);
  }

  return mermaid;
}

// Ensure we only try to register layouts once
let MermaidPromise: Promise<Mermaid> | null = null;

// We load Mermaid with a dynamic import to code split / lazy load the library
// It is only called inside a useEffect, so loading can be deferred
// We memoize so that we don't load and register layouts multiple times
export async function loadMermaid(): Promise<Mermaid> {
  if (!MermaidPromise) {
    MermaidPromise = loadMermaidAndRegisterLayouts();
  }
  return MermaidPromise;
}
