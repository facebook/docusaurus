---
name: dependencies
description: Add, remove or upgrade npm dependencies in the Docusaurus monorepo. Use before editing any `package.json` dependency field, running `pnpm add`/`pnpm remove`/`pnpm update`, or changing `pnpm-lock.yaml`.
---

# Dependencies

## Lockfile

- Run `pnpm dedupe` after any lockfile change. CI fails if `pnpm-lock.yaml` is not deduplicated (`pnpm lint:deps`).
- Run `pnpm lint:syncpack`: the same dependency must use the same version range in all packages.
- Site template dependencies live in `packages/create-docusaurus/templates/`. Never edit `examples/`, it is CLI-generated.

## Dependabot groups

`.github/dependabot.yml` groups packages that must be upgraded atomically in a single PR. Upgrading them separately produces broken intermediate PRs.

When you add a dependency, check whether it must stay in sync with other dependencies of the monorepo. It does when, for example:

- One package pins an exact version of the other (`@svgr/webpack` pins `@svgr/core` and `@svgr/plugin-*`).
- One package has a peer dependency on the exact same version of the other (`@types/react-dom` and `@types/react`).
- The packages check at runtime that their versions match (`react` and `react-dom`).
- Mixing versions duplicates a singleton package (`react-router` and `react-router-dom`).
- The packages are released in lockstep and mixing versions breaks typechecking (`typescript-eslint`).

If so, make sure a group of `.github/dependabot.yml` matches the new dependency:

- If an existing group pattern already matches it (`@svgr/*` matches `@svgr/plugin-jsx`), there is nothing to do.
- Otherwise, add the package to the matching group, or create a new group. Follow the existing groups: one group per family, with a comment explaining why the packages must be upgraded together.

Do the same when you notice a Dependabot PR that can't pass CI on its own because a related package wasn't upgraded with it.
