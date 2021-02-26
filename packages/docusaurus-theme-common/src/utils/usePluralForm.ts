/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type SelectPluralForm = (count: number) => Intl.LDMLPluralRule;

// Hardcoded fallback implementation
const EnglishPluralFormSelector: SelectPluralForm = (count) =>
  count === 1 ? 'one' : 'other';

// Poor man's PluralSelector implementation, using an english fallback.
// We want a lightweight, future-proof and good-enough solution.
// We don't want a perfect and heavy solution.
//
// Docusaurus classic theme has only 2 deeply nested labels requiring complex plural rules
// We don't want to use Intl + PluralRules polyfills + full ICU syntax (react-intl) just for that.
//
// Notes:
// - 2021: 92+% Browsers support Intl.PluralRules, and support will increase in the future
// - NodeJS >= 13 has full ICU support by default
// - In case of "mismatch" between SSR and Browser ICU support, React keeps working!
export function usePluralFormSector(): SelectPluralForm {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return useCallback(
    (count) => {
      if (Intl && Intl.PluralRules) {
        try {
          return new Intl.PluralRules(currentLocale).select(count);
        } catch (e) {
          console.error(`Failed to use Intl.PluralRules for locale=${currentLocale} and count=${count}.
Docusaurus will fallback to a default/fallback (English) Intl.PluralRules implementation.
`);
          return EnglishPluralFormSelector(count);
        }
      } else {
        console.error(`Intl.PluralRules not available!
Docusaurus will fallback to a default/fallback (English) Intl.PluralRules implementation.
        `);
        return EnglishPluralFormSelector(count);
      }
    },
    [currentLocale],
  );
}
