/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useCallback, useEffect, useState, type ReactNode} from 'react';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

type OnBlockerCall = (message: string) => void;

function NavigationBlocker({
  name,
  block,
  onCall,
}: {
  name: string;
  block: boolean;
  onCall: OnBlockerCall;
}) {
  const history = useHistory();
  useEffect(() => {
    return history.block((location, action) => {
      const result = block ? 'blocked' : 'let through';
      onCall(`${name}: ${action} ${location.pathname} ${result}`);
      return block ? false : undefined;
    });
  }, [history, name, block, onCall]);
  return null;
}

function OptionalBlocker({onCall}: {onCall: OnBlockerCall}) {
  const [enabled, setEnabled] = useState(true);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />{' '}
        Register the inner blocker
      </label>
      {enabled && (
        <NavigationBlocker name="Inner blocker" block={false} onCall={onCall} />
      )}
    </>
  );
}

// Test for https://github.com/meta/docusaurus/issues/10988
export default function HistoryTestsPage(): ReactNode {
  const [calls, setCalls] = useState<string[]>([]);
  const onCall = useCallback(
    (message: string) => setCalls((c) => [...c, message]),
    [],
  );
  return (
    <Layout>
      <main className="container margin-vert--lg">
        <Heading as="h1">History tests</Heading>
        <p>
          This page registers several <code>history.block()</code> blockers, and
          should block navigation.
        </p>
        <ul>
          <li>
            Navigate: the inner blocker lets navigation through, then the outer
            blocker blocks it.
          </li>
          <li>
            On mobile, open the navbar sidebar and go back: the sidebar closes,
            and no blocker is called. Go back again: the blockers are called.
          </li>
        </ul>
        <NavigationBlocker name="Outer blocker" block onCall={onCall} />
        <OptionalBlocker onCall={onCall} />
        <Heading as="h2">Blocker calls</Heading>
        <ol>
          {calls.map((call, i) => (
            <li key={i}>{call}</li>
          ))}
        </ol>
      </main>
    </Layout>
  );
}
