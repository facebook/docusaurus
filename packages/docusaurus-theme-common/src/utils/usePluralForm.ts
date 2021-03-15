/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// We want to ensurer a stable plural form order in all cases
// It is more convenient and natural to handle "small values" first
// See https://twitter.com/sebastienlorber/status/1366820663261077510
const OrderedPluralForms: Intl.LDMLPluralRule[] = [
  'zero',
  'one',
  'two',
  'few',
  'many',
  'other',
];
function sortPluralForms(
  pluralForms: Intl.LDMLPluralRule[],
): Intl.LDMLPluralRule[] {
  return OrderedPluralForms.filter((pf) => pluralForms.includes(pf));
}

type LocalePluralForms = {
  locale: string;
  pluralForms: Intl.LDMLPluralRule[];
  select: (count: number) => Intl.LDMLPluralRule;
};

// Hardcoded english/fallback implementation
const EnglishPluralForms: LocalePluralForms = {
  locale: 'en',
  pluralForms: sortPluralForms(['one', 'other']),
  select: (count) => (count === 1 ? 'one' : 'other'),
};

function createLocalePluralForms(locale: string): LocalePluralForms {
  const pluralRules = new Intl.PluralRules(locale);
  return {
    locale,
    pluralForms: sortPluralForms(
      pluralRules.resolvedOptions().pluralCategories,
    ),
    select: (count) => pluralRules.select(count),
  };
}

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
function useLocalePluralForms(): LocalePluralForms {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return useMemo(() => {
    // @ts-expect-error checking Intl.PluralRules in case browser doesn't have it (e.g Safari 12-)
    if (Intl.PluralRules) {
      try {
        return createLocalePluralForms(currentLocale);
      } catch (e) {
        console.error(`Failed to use Intl.PluralRules for locale=${currentLocale}.
Docusaurus will fallback to a default/fallback (English) Intl.PluralRules implementation.
`);
        return EnglishPluralForms;
      }
    } else {
      console.error(`Intl.PluralRules not available!
Docusaurus will fallback to a default/fallback (English) Intl.PluralRules implementation.
        `);
      return EnglishPluralForms;
    }
  }, [currentLocale]);
}

function selectPluralMessage(
  pluralMessages: string,
  count: number,
  localePluralForms: LocalePluralForms,
): string {
  const separator = '|';
  const parts = pluralMessages.split(separator);

  if (parts.length === 1) {
    return parts[0];
  } else {
    if (parts.length > localePluralForms.pluralForms.length) {
      console.error(
        `For locale=${localePluralForms.locale}, a maximum of ${localePluralForms.pluralForms.length} plural forms are expected (${localePluralForms.pluralForms}), but the message contains ${parts.length} plural forms: ${pluralMessages} `,
      );
    }
    const pluralForm = localePluralForms.select(count);
    const pluralFormIndex = localePluralForms.pluralForms.indexOf(pluralForm);
    // In case of not enough plural form messages, we take the last one (other) instead of returning undefined
    return parts[Math.min(pluralFormIndex, parts.length - 1)];
  }
}

export function usePluralForm() {
  const localePluralForm = useLocalePluralForms();
  return {
    selectMessage: (count: number, pluralMessages: string): string => {
      return selectPluralMessage(pluralMessages, count, localePluralForm);
    },
  };
}
