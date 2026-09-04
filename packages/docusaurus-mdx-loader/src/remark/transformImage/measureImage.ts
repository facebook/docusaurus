/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {imageDimensionsFromData} from 'image-dimensions';
import logger from '@docusaurus/logger';
import type {MeasureImageFunction, MeasureImageSize} from '@docusaurus/types';

function parseLength(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function getSvgAttribute(attributes: string, name: string): string | undefined {
  const match = attributes.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

export function measureSvg(buffer: Uint8Array): MeasureImageSize | null {
  const text = Buffer.from(buffer).toString('utf8');
  const svgTag = text.match(/<svg\b([^>]*)>/i);
  if (!svgTag) {
    return null;
  }
  const attributes = svgTag[1] ?? '';
  const width = parseLength(getSvgAttribute(attributes, 'width'));
  const height = parseLength(getSvgAttribute(attributes, 'height'));
  if (width !== undefined && height !== undefined) {
    return {width, height};
  }
  const viewBox = getSvgAttribute(attributes, 'viewBox');
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/);
    const viewBoxWidth = Number.parseFloat(parts[2] ?? '');
    const viewBoxHeight = Number.parseFloat(parts[3] ?? '');
    if (
      Number.isFinite(viewBoxWidth) &&
      Number.isFinite(viewBoxHeight) &&
      viewBoxWidth > 0 &&
      viewBoxHeight > 0
    ) {
      return {
        width: width ?? viewBoxWidth,
        height: height ?? viewBoxHeight,
      };
    }
  }
  if (width !== undefined || height !== undefined) {
    return {width, height};
  }
  return null;
}

function looksLikeSvg(buffer: Uint8Array, imagePath: string): boolean {
  if (path.extname(imagePath).toLowerCase() === '.svg') {
    return true;
  }
  const head = Buffer.from(buffer.subarray(0, 256))
    .toString('utf8')
    .trimStart();
  return (
    head.startsWith('<svg') ||
    (head.startsWith('<?xml') && head.toLowerCase().includes('<svg'))
  );
}

function logUnreadableImage(imagePath: string, err?: unknown): void {
  // Workaround for https://github.com/yarnpkg/berry/pull/3889#issuecomment-1034469784
  // TODO remove this check once fixed in Yarn PnP
  if (process.versions.pnp) {
    return;
  }
  if (err) {
    console.error(err);
  }
  const extra = err instanceof Error ? err.message : '';
  logger.warn`The image at path=${imagePath} can't be read correctly. Please ensure it's a valid image.
${extra}`;
}

export const defaultMeasureImage: MeasureImageFunction = async ({
  imagePath,
}) => {
  try {
    const buffer = await fs.readFile(imagePath);
    const size = looksLikeSvg(buffer, imagePath)
      ? measureSvg(buffer)
      : imageDimensionsFromData(buffer);
    if (!size?.width && !size?.height) {
      logUnreadableImage(imagePath);
      return null;
    }
    return {
      ...(size.width ? {width: size.width} : {}),
      ...(size.height ? {height: size.height} : {}),
    };
  } catch (err) {
    logUnreadableImage(imagePath, err);
    return null;
  }
};

export async function readImageSize(
  imagePath: string,
  measureImage: MeasureImageFunction = defaultMeasureImage,
): Promise<MeasureImageSize | null> {
  try {
    const size = await measureImage({imagePath});
    if (!size?.width && !size?.height) {
      return null;
    }
    return size;
  } catch (err) {
    logUnreadableImage(imagePath, err);
    return null;
  }
}
