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

const ValueRegexp = /{\w+}/g;
const ValueFoundMarker = '{}'; // does not care much

// TODO use TS template literal feature to make values typesafe!
// (requires upgrading TS first)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractInterpolatePlaceholders<Str extends string> = string;

type InterpolateValues<Str extends string, Value extends ReactNode> = Record<
  ExtractInterpolatePlaceholders<Str>,
  Value
>;

// TS function overload: if all the values are plain strings, then interpolate returns a simple string
export function interpolate<Str extends string>(
  text: Str,
  values?: InterpolateValues<Str, string | number>,
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
  const elements: (Value | string)[] = [];

  const processedText = text.replace(ValueRegexp, (match: string) => {
    // remove {{ and }} around the placeholder
    const key = match.substr(
      1,
      match.length - 2,
    ) as ExtractInterpolatePlaceholders<Str>;

    const value = values?.[key];

    if (typeof value !== 'undefined') {
      const element = React.isValidElement(value)
        ? value
        : // For non-React elements: basic primitive->string conversion
          String(value);
      elements.push(element);
      return ValueFoundMarker;
    } else {
      return match; // no match? add warning?
    }
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

export type InterpolateProps<Str extends string> = {
  children: Str;
  values?: InterpolateValues<Str, ReactNode>;
};

export default function Interpolate<Str extends string>({
  children,
  values,
}: InterpolateProps<Str>) {
  return interpolate(children, values);
}
