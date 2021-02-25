/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';

/*
Minimal implementation of a React interpolate component.
We don't ship a markdown parser nor a feature-complete i18n library on purpose.
More details here: https://github.com/facebook/docusaurus/pull/4295
*/

const ValueRegexp = /{{\w+}}/g;
const ValueFoundMarker = '{{}}'; // does not care much

// TODO use TS template literal feature to make values typesafe!
// (requires upgrading TS first)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractInterpolateParams<Str extends string> = string;

type InterpolateValues<Str extends string, Value extends ReactNode> = Record<
  ExtractInterpolateParams<Str>,
  Value
>;

// TS function overload: if all the values are plain strings, then interpolate returns a simple string
export function interpolate<Str extends string>(
  text: Str,
  values?: InterpolateValues<Str, string>,
): string;

// If values contain any ReactNode, then the return is a ReactNode
export function interpolate<Str extends string, Value extends ReactNode>(
  text: Str,
  values?: InterpolateValues<Str, Value>,
): ReactNode;

export function interpolate<Str extends string, Value extends ReactNode>(
  text: Str,
  values?: InterpolateValues<Str, Value>,
): ReactNode {
  const elements: Value[] = [];

  const processedText = text.replace(ValueRegexp, (match: string) => {
    // remove {{ and }} around the placeholder
    const key = match.substr(
      2,
      match.length - 4,
    ) as ExtractInterpolateParams<Str>;

    const value = values?.[key];

    if (React.isValidElement(value) || typeof value === 'string') {
      elements.push(value);
      return ValueFoundMarker;
    }

    return match;
  });

  // No interpolation to be done: just return the text
  if (elements.length === 0) {
    return text;
  }
  // Basic string interpolation: returns interpolated string
  else if (elements.every((el) => typeof el === 'string')) {
    return processedText
      .split(ValueFoundMarker)
      .reduce<string>((str, value, index) => {
        return str.concat(value).concat((elements[index] as string) ?? '');
      }, '');
  }
  // JSX interpolation: returns ReactNode
  else {
    return processedText
      .split(ValueFoundMarker)
      .reduce<ReactNode[]>((array, value, index) => {
        return [
          ...array,
          <React.Fragment key={index}>
            {value}
            {elements[index]}
          </React.Fragment>,
        ];
      }, []);
  }
}

export type InterpolateProps<Str extends string, Value extends ReactNode> = {
  children: Str;
  values?: InterpolateValues<Str, Value>;
};

export default function Interpolate<
  Str extends string,
  Value extends ReactNode
>({children, values}: InterpolateProps<Str, Value>) {
  return interpolate(children, values);
}
