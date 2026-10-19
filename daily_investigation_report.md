# Daily Investigation Report: Docusaurus Issue #12429

**Date:** October 19, 2026  
**Issue:** facebook/docusaurus #12429 — "Sidebar Navigation Font Style Randomly Changes While Scrolling"  
**Branch:** `fix/issue-12429-sidebar-font-flicker`  
**Current HEAD Commit:** `cd732b7c8` ("Modified the css styles")  
**Investigator:** Kalvium Open Source Contributor

---

## 1. Executive Summary

Today's investigation continued work on Issue #12429. The reported defect describes transient left sidebar font-weight/style changes ("flickering") when scrolling upward on long documentation pages.

Key outcomes of today's work:

1. **GitHub Issue Status:** The issue remains `OPEN` with labels `bug` and `status: needs triage`. No maintainer has triaged or assigned the issue, and no PR has been linked. Six community comments have been posted, none providing reproducible steps beyond the original report.
2. **Announcement Bar Behavior:** Investigated whether the announcement bar (`docusaurus.config.ts` and `DocSidebar/Desktop/Content/index.tsx`) triggers the re-render or layout shifts during scroll.
3. **Reproduction Testing:** Executed extensive browser-based scroll cycles on long documentation pages (`/docs/api/themes/configuration`) under both states:
   - **Announcement Bar Enabled:** 4 downward and upward scroll cycles.
   - **Announcement Bar Disabled:** 4 downward and upward scroll cycles.
   - **Result:** The font flicker bug could **not** be reproduced in either state. Text font-family, font-weight, and rendering remained completely stable throughout all scroll operations.
4. **Hypothesis Evaluation (`will-change: width;`):** Evaluated commit `cd732b7c8`, which commented out `will-change: width;` in `packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/Sidebar/styles.module.css`. Found that this change is **speculative** and lacks empirical evidence. Furthermore, the original report attached a mobile viewport screenshot (375x828) where desktop sidebar styles (`@media (width >= 997px)`) do not even apply.
5. **Quality Checks:** Verified stylelint (`pnpm lint:style`) and Vitest test suites (`packages/docusaurus-theme-classic`); all 64 tests passed with 0 errors.
6. **Contribution Path:** Per repository guidelines (`AGENTS.md` and `CONTRIBUTING.md`), we must not submit unverified or speculative fixes as PRs. The appropriate next step is documenting the investigation and seeking reporter/maintainer clarification regarding their environment (browser, OS, GPU rasterization, display scaling).

---

## 2. Git Status and Branch Inspection

- **Branch:** `fix/issue-12429-sidebar-font-flicker` (tracking `main`)
- **Working Tree:** Clean (all prior changes committed in `cd732b7c8`)
- **Recent Commits:**
  - `cd732b7c8` - Modified the css styles (commented out `will-change: width;`)
  - `baaa90693` - refactor(mdx-loader): replace stringify-object with estree-util-value-to-estree + astring (AI-assisted) (#12504)
  - `e8acadcfb` - refactor(mdx-loader): wrap stringify-object in a local serializeJS() abstraction (AI-assisted) (#12503)
- **Diff in `cd732b7c8`:**
  ```diff
  diff --git a/packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/Sidebar/styles.module.css b/packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/Sidebar/styles.module.css
  --- a/packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/Sidebar/styles.module.css
  +++ b/packages/docusaurus-theme-classic/src/theme/DocRoot/Layout/Sidebar/styles.module.css
  @@ -20,7 +20,7 @@
       width: var(--doc-sidebar-width);
       margin-top: calc(-1 * var(--ifm-navbar-height));
       border-right: 1px solid var(--ifm-toc-border-color);
  -    will-change: width;
  +    /* will-change: width; */
       transition: width var(--ifm-transition-fast) ease;
       clip-path: inset(0);
     }
  ```

---

## 3. Upstream Issue Review (facebook/docusaurus#12429)

- **Title:** Sidebar Navigation Font Style Randomly Changes While Scrolling
- **Reporter:** `vinothkumarGanesan` (Opened Sept 9, 2026)
- **Labels:** `bug`, `status: needs triage`
- **State:** `OPEN` (Unassigned, 0 linked PRs)
- **Reported Behavior:**
  - Intermittent font-weight/style change in left sidebar items when scrolling upward from lower page sections.
  - Returns to normal after a few seconds or further scrolling.
  - No console errors.
  - Attached screenshot has metadata dimensions of `375 x 828` px (mobile portrait viewport).
- **Recent Community Interactions:**
  - `AbarnaaSree` (Sept 12): Volunteered to investigate.
  - `UdaySharmaGitHub` (Sept 20): Noted they could not reproduce the issue, suggested it might be environment/network-related.
  - `fulluhere` (Sept 23): Referenced issue #12429.
  - `Jashvanthan` (Sept 29): Asked maintainers if issue is open.
  - `BhavishTrehan77` (Oct 7): Requested assignment.
  - `Tejas-V-P` (Oct 9): Volunteered to investigate scroll-visibility/IntersectionObserver.
- **Maintainer Feedback:** None to date. No triage confirmation that this is an upstream Docusaurus bug.

---

## 4. Code & Architecture Analysis

### A. Announcement Bar & Sidebar Interaction

- `website/docusaurus.config.ts`:
  ```ts
  announcementBar: {
    id: `announcementBar-v${announcedVersion}`,
    content: `🎉️ <b><a target="_blank" href="...">Docusaurus v${announcedVersion}</a> is out!</b> 🥳️`,
  }
  ```
- In `packages/docusaurus-theme-classic/src/theme/DocSidebar/Desktop/Content/index.tsx`:

  ```tsx
  function useShowAnnouncementBar() {
    const {isActive} = useAnnouncementBar();
    const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

    useScrollPosition(
      ({scrollY}) => {
        if (isActive) {
          setShowAnnouncementBar(scrollY === 0);
        }
      },
      [isActive],
    );
    return isActive && showAnnouncementBar;
  }
  ```

  - When scrolling starts (`scrollY > 0`), `showAnnouncementBar` flips from `true` to `false`, toggling `.menuWithAnnouncementBar` (`margin-bottom: var(--docusaurus-announcement-bar-height)`).
  - When scrolling reaches top (`scrollY === 0`), it flips back to `true`.
  - While this triggers a re-render of `DocSidebarDesktopContent`, font styles are inherited from Infima theme CSS (`--ifm-font-family-base`, `--ifm-menu-color`), and no inline font properties or weight classes change on scroll.

### B. Critique of `will-change: width;` Removal

- `will-change: width;` exists on `.docSidebarContainer` inside `@media (width >= 997px)` to assist hardware-accelerated transitions during sidebar collapse/expand.
- While `will-change` creates a compositing layer in WebKit/Blink (which historically could alter subpixel font antialiasing on certain Windows ClearType setups), **scrolling down/up does not touch `width`**.
- Most significantly, the reporter's screenshot was taken on a mobile resolution (375x828), where `.docSidebarContainer` has `display: none` and the mobile drawer (`DocSidebarMobile`) is rendered instead.
- **Conclusion:** Removing `will-change: width;` is an unverified hypothesis and does not have empirical justification.

---

## 5. Empirical Reproduction & Testing

### Test Setup

- **Target Page:** `https://docusaurus.io/docs/api/themes/configuration` (extended documentation with hierarchical sidebar).
- **Environment:** Chromium / Playwright Browser Automation (1280x800 desktop and responsive testing).
- **Artifacts Recorded:**
  - Browser recording: `repro_scroll_test_1792403319160.webp`
  - Baseline screenshot with announcement bar: `theme_configuration_page_1792403391381.png`
  - Screenshot after announcement bar dismissal: `announcement_bar_dismissed_1792403513353.png`

### Test Cycles & Results

| Phase | Condition | Action | Result |
| --- | --- | --- | --- |
| 1 | Announcement Bar Present | 4x full scroll cycles (0px -> 3200px -> 0px) | No font flicker, weight change, or visual artifact observed |
| 2 | Announcement Bar Dismissed | Clicked `[x]` to dismiss bar, verified DOM removal | No layout instability |
| 3 | Announcement Bar Dismissed | 4x full scroll cycles (0px -> 3200px -> 0px) | No font flicker, weight change, or visual artifact observed |

### Quality & Regression Verification Commands

- **Stylelint:**
  ```powershell
  pnpm lint:style
  # Result: Exited with code 0. No styling errors found.
  ```
- **Vitest Suite (`@docusaurus/theme-classic`):**
  ```powershell
  pnpm test packages/docusaurus-theme-classic
  # Result:
  # ✓ packages/docusaurus-theme-classic/src/__tests__/inlineScripts.test.ts (2 tests)
  # ✓ packages/docusaurus-theme-classic/src/__tests__/translations.test.ts (6 tests)
  # ✓ packages/docusaurus-theme-classic/src/__tests__/options.test.ts (43 tests)
  # ✓ packages/docusaurus-theme-classic/src/theme/Tabs/__tests__/index.test.tsx (13 tests)
  # Test Files: 4 passed (4)
  # Tests: 64 passed (64)
  ```

---

## 6. Contribution Guidelines & `AGENTS.md` Compliance

- **No Premature PR / Issue Creation:** Per `AGENTS.md` and repository guidelines, external contributors must not submit speculative or unvalidated AI-driven PRs.
- **Preservation of Existing Work:** Branch `fix/issue-12429-sidebar-font-flicker` and commit `cd732b7c8` have been preserved. No uncommitted modifications have altered the tree.
- **Upstream Status:** The issue remains open and untriaged on GitHub. We will not claim the issue is resolved upstream.

---

## 7. Unresolved Questions & Next Steps

### Unresolved Questions

1. Under what specific client hardware or browser conditions did the reporter witness the font flicker? (e.g., Windows ClearType disabled, discrete GPU vs integrated GPU, specific Chrome/Edge flags, or macOS ProMotion variable refresh rates).
2. Was the font flicker caused by external web fonts loading asynchronously (FOUT - Flash of Unstyled Text) during initial scroll rather than a scroll listener bug?
3. Did the reporter reproduce this on a mobile browser or a desktop browser with dev tools responsive view enabled?

### Recommended Next Steps

1. **Maintainer / Issue Discussion:** Post a factual, structured comment on GitHub Issue #12429 detailing our reproduction attempts across desktop and mobile viewports with announcement bar enabled and disabled, asking the reporter for exact OS, browser version, zoom level, and GPU acceleration settings.
2. **Hold on Submitting Code Changes:** Do not submit a PR for `will-change: width;` since there is no proof it solves the problem and it might degrade sidebar collapse performance.
3. **If Maintainer Confirms Non-Reproducibility:** Suggest closing the issue as `cannot reproduce` unless additional environment details or a minimal reproduction repository can be provided.
