/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Sanitizes HTML content from Algolia search results.
 * Algolia returns HTML with highlight tags (<em>) that we need to preserve,
 * but we must strip any potentially malicious content.
 *
 * This is a lightweight sanitizer that:
 * - Allows only safe tags: <em>, <mark>, <strong>, <b>, <i>
 * - Strips all attributes except 'class' on allowed tags
 * - Removes all other HTML tags and their content
 * - Escapes any remaining HTML entities
 */

const ALLOWED_TAGS = ['em', 'mark', 'strong', 'b', 'i'];
const ALLOWED_ATTRIBUTES = ['class'];

/**
 * Sanitizes HTML string by allowing only safe formatting tags.
 * This prevents XSS attacks while preserving search result highlighting.
 */
export function sanitizeHtml(html: string): string {
  if (!html) {
    return '';
  }

  // Only run in browser environment
  if (!ExecutionEnvironment.canUseDOM) {
    // In SSR/test environment, use regex-based sanitization
    return sanitizeHtmlRegex(html);
  }

  // Create a temporary DOM element to parse HTML
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Recursive function to sanitize nodes
  function sanitizeNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      // Text nodes are safe, just escape HTML entities
      return escapeHtml(node.textContent || '');
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // If tag is not allowed, return only its text content (stripped)
      if (!ALLOWED_TAGS.includes(tagName)) {
        return escapeHtml(element.textContent || '');
      }

      // Process allowed tags
      const children = Array.from(element.childNodes)
        .map((child) => sanitizeNode(child))
        .join('');

      // Build the sanitized tag with allowed attributes only
      const attributes = Array.from(element.attributes)
        .filter((attr) => ALLOWED_ATTRIBUTES.includes(attr.name.toLowerCase()))
        .map((attr) => `${attr.name}="${escapeHtml(attr.value)}"`)
        .join(' ');

      const attrString = attributes ? ` ${attributes}` : '';
      return `<${tagName}${attrString}>${children}</${tagName}>`;
    }

    return '';
  }

  // Process all nodes in the body
  return Array.from(doc.body.childNodes)
    .map((node) => sanitizeNode(node))
    .join('');
}

/**
 * Regex-based sanitization for SSR/test environments.
 * Less robust than DOM-based but works without browser APIs.
 */
function sanitizeHtmlRegex(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  );

  // Remove dangerous tags
  sanitized = sanitized.replace(
    /<(iframe|object|embed|link|style)[^>]*>.*?<\/\1>/gi,
    '',
  );
  sanitized = sanitized.replace(/<(img|input|form)[^>]*>/gi, '');

  // Remove event handlers and dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  sanitized = sanitized.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(
    /\s*href\s*=\s*["']javascript:[^"']*["']/gi,
    '',
  );

  // Keep only allowed tags with class attribute
  sanitized = sanitized.replace(
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    /<(\w+)([^>]*)>/g,
    (match, tag, attrs) => {
      const tagLower = tag.toLowerCase();
      if (!ALLOWED_TAGS.includes(tagLower)) {
        return '';
      }
      // Extract class attribute if present
      const classMatch = attrs.match(/\s*class\s*=\s*["']([^"']*)["']/i);
      if (classMatch) {
        return `<${tagLower} class="${escapeHtml(classMatch[1])}">`;
      }
      return `<${tagLower}>`;
    },
  );

  // Remove closing tags for non-allowed tags
  sanitized = sanitized.replace(/<\/(\w+)>/g, (match, tag) => {
    const tagLower = tag.toLowerCase();
    return ALLOWED_TAGS.includes(tagLower) ? match : '';
  });

  return sanitized;
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]!);
}

/**
 * Sanitizes Algolia search result value by:
 * 1. Replacing Algolia-specific CSS classes with our own
 * 2. Sanitizing HTML to prevent XSS attacks
 */
export function sanitizeAlgoliaHtml(value: string): string {
  // First replace Algolia CSS classes
  const withReplacedClasses = value.replace(
    /algolia-docsearch-suggestion--highlight/g,
    'search-result-match',
  );

  // Then sanitize the HTML
  return sanitizeHtml(withReplacedClasses);
}
