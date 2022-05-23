/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext, useEffect, useState, type ReactNode} from 'react';
import {useDocsPreferredVersion} from '@docusaurus/theme-common';
import {useVersions} from '@docusaurus/plugin-content-docs/client';
import Translate from '@docusaurus/Translate';
import CodeBlock from '@theme/CodeBlock';

type ContextValue = {
  name: string;
  time: string;
};

const Context = React.createContext<ContextValue | null>(null);

export function VersionsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [canaryVersion, setCanaryVersion] = useState<ContextValue | null>(null);
  useEffect(() => {
    fetch('https://registry.npmjs.org/@docusaurus/core')
      .then((res) => res.json())
      .then(
        (data: {versions: string[]; time: {[versionName: string]: string}}) => {
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
    allVersions.find((v) => v.name !== 'current') ?? allVersions[0]
  ).name;
  return preferredVersion && preferredVersion !== 'current'
    ? preferredVersion
    : lastVersion;
}

export function CanaryVersion(): JSX.Element {
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

export function StableVersion(): JSX.Element {
  const currentVersion = useStableVersion();
  return <span>{currentVersion}</span>;
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

export function PackageJSONDiff(): JSX.Element {
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

export function PublishTime(): JSX.Element | null {
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
