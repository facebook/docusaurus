/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {FAQ} from '@docusaurus/mdx-loader';

export default function StructuredDataFaqs({
  faqs,
}: {
  faqs: FAQ[];
}): JSX.Element | null {
  return faqs ? (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      })}
    </script>
  ) : null;
}
