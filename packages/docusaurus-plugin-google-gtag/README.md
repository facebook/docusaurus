# `@docusaurus/plugin-google-gtag`

Global Site Tag (gtag.js) plugin for Docusaurus.

## Features

- **Duplicate Prevention**: Automatically detects if Google Analytics is already loaded and prevents duplicate initialization
- **Multiple Tracking IDs**: Support for multiple GA tracking IDs
- **Route Tracking**: Automatic page view tracking on route changes
- **Performance Optimized**: Includes preconnect links for faster GA loading

## Duplicate Prevention

This plugin automatically prevents duplicate Google Analytics initialization by checking for:

- Existing `window.gtag` function
- Existing `window.dataLayer` array
- Existing GA script tags in the DOM

This is particularly useful when your Docusaurus site is embedded within a larger website that already has Google Analytics configured.

## Usage

See [plugin-google-gtag documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag).
