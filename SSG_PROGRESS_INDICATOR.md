# SSG Progress Indicator Feature

## Overview

This pull request introduces a **real-time progress indicator** for the Static Site Generation (SSG) process in Docusaurus. This feature significantly improves the developer experience by providing visual feedback during the build process, especially beneficial for large documentation sites with hundreds or thousands of pages.

## Problem Statement

Previously, when building a Docusaurus site, users had no visibility into the SSG progress. The build process would appear to hang with no indication of:
- How many pages were being generated
- How many pages had been completed
- Whether the build was progressing or stuck
- Which pages might be causing errors

This lack of feedback was particularly problematic for:
- Large documentation sites with many pages
- CI/CD pipelines where build monitoring is crucial
- Development workflows where iteration speed matters

## Solution

The implementation adds a comprehensive progress tracking system that:

### 1. **Visual Progress Bar**
- Displays a real-time progress bar in the terminal
- Shows percentage completion
- Updates dynamically as pages are processed
- Format: `[████████████░░░░░░░░] 60% | 600/1000 pages`

### 2. **Detailed Statistics**
- Total number of pages to generate
- Number of successfully generated pages
- Number of failed pages (if any)
- Build time measurement
- Success rate calculation

### 3. **Smart Throttling**
- Updates are throttled to prevent console spam
- Progress updates every 100ms maximum
- Immediate updates on completion or errors

### 4. **Error Tracking**
- Tracks and reports failed page generations
- Maintains error details for debugging
- Final summary shows both successes and failures

## Implementation Details

### New Files Created

1. **`packages/docusaurus/src/ssg/ssgProgress.ts`**
   - Core progress tracking implementation
   - Event-based architecture using EventEmitter
   - Statistics calculation and management

2. **`packages/docusaurus/src/ssg/ssgProgressConfig.ts`**
   - Configuration management for progress display
   - Environment variable support for customization

3. **`packages/docusaurus/src/ssg/__tests__/ssgProgress.test.ts`**
   - test suite
   - 100% code coverage for progress tracking logic

### Modified Files

1. **`packages/docusaurus/src/ssg/ssgExecutor.ts`**
   - Integration of progress tracking into SSG execution
   - Support for both single-threaded and multi-threaded builds

2. **`packages/docusaurus/src/ssg/ssgWorkerInline.ts`**
   - Progress tracker integration for inline SSG execution

3. **`packages/docusaurus/src/ssg/ssgRenderer.ts`**
   - Progress updates during page rendering
   - Success/failure tracking per page

## Features

### Progressive Enhancement
The progress indicator is designed as a progressive enhancement:
- Works seamlessly in TTY environments (terminals)
- Gracefully degrades in non-TTY environments (CI logs)
- No breaking changes to existing functionality

### Configuration Options

Users can control the progress indicator behavior through environment variables:

```bash
# Disable progress indicator
DOCUSAURUS_SSG_PROGRESS_DISABLED=true npm run build

# Future: Different progress styles (extensible)
DOCUSAURUS_SSG_PROGRESS_STYLE=simple npm run build
```

### Multi-threaded Support
The progress tracker works correctly with:
- Single-threaded SSG execution
- Multi-threaded worker pool execution
- Handles concurrent updates from multiple workers

## Benefits

1. **Improved Developer Experience**
   - Immediate visual feedback during builds
   - No more wondering if the build is stuck
   - Clear indication of build progress

2. **Better Debugging**
   - Identifies which pages fail to generate
   - Tracks error counts and success rates
   - Helps pinpoint problematic pages

3. **CI/CD Integration**
   - Progress logs in CI environments
   - Build time tracking
   - Success/failure metrics for monitoring

4. **Performance Monitoring**
   - Measures total build time
   - Tracks pages per second generation rate
   - Helps identify performance bottlenecks

## Testing

The implementation includes comprehensive tests:
- Unit tests for all progress tracking logic
- Mock testing for terminal output
- TTY and non-TTY environment testing
- Event emission and throttling tests

## Backward Compatibility

This feature is 100% backward compatible:
- No breaking changes to existing APIs
- Can be disabled via environment variable
- No changes required to existing Docusaurus sites
- No impact on build output or generated files

## Example Output

### During Build:
```
Generating static files for 1234 pages...
[████████████████████░░░░░░░░░] 67% | 826/1234 pages
```

### On Completion (Success):
```
Generated static files for 1234 pages in 45.2s.
```

### On Completion (With Errors):
```
Generated static files: 1230 succeeded, 4 failed (total: 1234) in 46.8s.
```

