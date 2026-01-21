# Fix for Issue #11671: Incomplete Page Translations

## Summary

This document provides guidance for fixing the "embedded translation doesn't translate the entire page" issue reported in #11671.

## Root Cause

The issue is **NOT a technical bug** in Docusaurus' i18n system. It's a **content completeness issue** where:

1. Some translation strings haven't been translated in Crowdin yet
2. New content was added but not uploaded to Crowdin
3. Translators haven't completed all pages

## Solution: Maintainer Workflow

For Docusaurus maintainers with Crowdin access:

### 1. Generate English Source Files

```bash
cd website
yarn write-translations --locale en
```

This creates base translation files in `i18n/en/`.

### 2. Upload to Crowdin

```bash
# Ensure CROWDIN_PERSONAL_TOKEN is set
yarn crowdin upload
```

### 3. Check Crowdin Project

Visit https://crowdin.com/project/docusaurus-v2 and verify:

- Translation completion % for each language
- No "hidden" strings that should be translated
- Recent uploads are processed

### 4. Download Translations

```bash
yarn crowdin download
```

### 5. Test Locally

```bash
# Test each locale
yarn start --locale fr
yarn start --locale pt-BR
# etc.
```

### 6. Deploy

Translations are automatically downloaded during CI builds via the existing workflow.

## For Contributors

If you notice untranslated content:

1. **Report** the specific page/section that's untranslated
2. **Check Crowdin** if you have access - the string might be marked as "hidden"
3. **Note** that brand new content needs time for translators to complete

## Related Files

- `crowdin-v2.yaml` - Crowdin CLI configuration
- `website/docusaurus.config.ts` - i18n locale configuration (lines 204-224)
- `.gitignore` - Translations are ignored (line 43)

## Testing

To verify translations work correctly:

```bash
# Check translation files exist
ls website/i18n/fr/
ls website/i18n/pt-BR/

# Build with all locales
yarn build

# Verify no build errors
```

## References

- Original Issue: #11671
- [i18n Documentation](https://docusaurus.io/docs/i18n/introduction)
- [Crowdin Integration Guide](https://docusaurus.io/docs/i18n/crowdin)
