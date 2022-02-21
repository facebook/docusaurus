/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import type {
  InterpolateProps,
  InterpolateValues,
  ExtractInterpolatePlaceholders,
} from '@docusaurus/Interpolate';

/*
Minimal implementation of a React interpolate component.
We don't ship a markdown parser nor a feature-complete i18n library on purpose.
More details here: https://github.com/facebook/docusaurus/pull/4295
*/

const ValueRegexp = /{\w+}/g;
const ValueFoundMarker = '{}'; // does not care much

// If all the values are plain strings, then interpolate returns a simple string
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
    const key = match.substring(
      1,
      match.length - 1,
    ) as ExtractInterpolatePlaceholders<Str>;

    const value = values?.[key];

    if (typeof value !== 'undefined') {
      const element = React.isValidElement(value)
        ? value
        : // For non-React elements: basic primitive->string conversion
          String(value);
      elements.push(element);
      return ValueFoundMarker;
    }
    return match; // no match? add warning?
  });

  // No interpolation to be done: just return the text
  if (elements.length === 0) {
    return text;
  }
  // Basic string interpolation: returns interpolated string
  if (elements.every((el) => typeof el === 'string')) {
    return processedText
      .split(ValueFoundMarker)
      .reduce<string>(
        (str, value, index) =>
          str.concat(value).concat((elements[index] as string) ?? ''),
        '',
      );
  }
  // JSX interpolation: returns ReactNode
  return processedText.split(ValueFoundMarker).reduce<ReactNode[]>(
    (array, value, index) => [
      ...array,
      <React.Fragment key={index}>
        {value}
        {elements[index]}
      </React.Fragment>,
    ],
    [],
  );
}

export default function Interpolate<Str extends string>({
  children,
  values,
}: InterpolateProps<Str>): ReactNode {
  if (typeof children !== 'string') {
    console.warn('Illegal <Interpolate> children', children);
    throw new Error(
      'The Docusaurus <Interpolate> component only accept simple string values',
    );
  }
  return interpolate(children, values);
}
