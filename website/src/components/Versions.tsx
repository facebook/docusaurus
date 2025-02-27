/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import {
  useVersions,
  useDocsPreferredVersion,
} from '@docusaurus/plugin-content-docs/client';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';

type ContextValue = {
  name: string;
  time: string | undefined;
};

const Context = React.createContext<ContextValue | null>(null);

export function VersionsProvider({children}: {children: ReactNode}): ReactNode {
  const [canaryVersion, setCanaryVersion] = useState<ContextValue | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    fetch('https://registry.npmjs.org/@docusaurus/core')
      .then((res) => res.json())
      .then(
        (data: {versions: string[]; time: {[versionName: string]: string}}) => {
          if (!mounted.current) {
            return;
          }
          const name = Object.keys(data.versions).at(-1)!;
          const time = data.time[name];
          setCanaryVersion({name, time});
        },
      );
  }, []);
  return <Context.Provider value={canaryVersion}>{children}</Context.Provider>;
}

function useStableVersion(): string {
  const preferredVersion =
    useDocsPreferredVersion('default').preferredVersion?.name;

  const allVersions = useVersions('default');
  const lastVersion = (
    allVersions.find((v) => v.name !== 'current') ?? allVersions[0]!
  ).name;
  return preferredVersion && preferredVersion !== 'current'
    ? preferredVersion
    : lastVersion;
}

export function CanaryVersion(): ReactNode {
  const canaryVersion = useContext(Context);
  // Show a sensible name
  return canaryVersion ? (
    <span>
      <Translate
        description="The hint text for the current canary version tag."
        values={{canaryVersionName: <b>{canaryVersion.name}</b>}}>
        {'Current: {canaryVersionName}'}
      </Translate>
    </span>
  ) : (
    <span>
      <Translate description="An example canary version tag when the actual version can't be fetched.">
        Example: 0.0.0-4922
      </Translate>
    </span>
  );
}

export function StableVersion(): ReactNode {
  const currentVersion = useStableVersion();
  return <span>{currentVersion}</span>;
}

// TODO temporary: assumes main is already on v3 (not the case yet)
function useNextMajorVersionNumber(): number {
  return 3; // TODO later read from main@package.json or something...
}
function useStableMajorVersionNumber(): number {
  // -1 because website is published from main, which is the next version
  return useNextMajorVersionNumber() - 1;
}

export function NextMajorVersion(): ReactNode {
  const majorVersionNumber = useNextMajorVersionNumber();
  return <span>{majorVersionNumber}</span>;
}

export function StableMajorVersion(): ReactNode {
  const majorVersionNumber = useStableMajorVersionNumber();
  return <span>{majorVersionNumber}</span>;
}

function GitBranchLink({branch}: {branch: string}): ReactNode {
  return (
    <Link to={`https://github.com/facebook/docusaurus/tree/${branch}`}>
      <code>{branch}</code>
    </Link>
  );
}

export function StableMajorBranchLink(): ReactNode {
  const majorVersionNumber = useStableMajorVersionNumber();
  const branch = `docusaurus-v${majorVersionNumber}`;
  return <GitBranchLink branch={branch} />;
}

export function NextMajorBranchLink(): ReactNode {
  return <GitBranchLink branch="main" />;
}

export function InsertIfCanaryVersionUnknown({
  children,
}: {
  children: ReactNode;
}): ReactNode | null {
  const canaryVersion = useContext(Context);
  if (!canaryVersion) {
    return children;
  }
  return null;
}

export function InsertIfCanaryVersionKnown({
  children,
}: {
  children: ReactNode;
}): ReactNode | null {
  const canaryVersion = useContext(Context);
  if (canaryVersion) {
    return children;
  }
  return null;
}

export function PackageJSONDiff(): ReactNode {
  const canaryVersion = useContext(Context)?.name ?? '0.0.0-4922';
  const stableVersion = useStableVersion();
  return (
    <CodeBlock language="diff">
      {`-  "@docusaurus/core": "^${stableVersion}",
-  "@docusaurus/preset-classic": "^${stableVersion}",
+  "@docusaurus/core": "${canaryVersion}",
+  "@docusaurus/preset-classic": "${canaryVersion}",
`}
    </CodeBlock>
  );
}

export function PublishTime(): ReactNode {
  const time = useContext(Context)?.time;
  if (!time) {
    return null;
  }
  return (
    <Translate values={{time: <b>{new Date(time).toLocaleString()}</b>}}>
      {
        "The latest canary version that's available on npm is published at {time}."
      }
    </Translate>
  );
}
