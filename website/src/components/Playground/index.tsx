/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import React from 'react';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';
import clsx from 'clsx';

const Playgrounds = [
  {
    name: '📦 CodeSandbox',
    image: require('@site/static/img/playgrounds/codesandbox.png'),
    url: 'https://docusaurus.new/codesandbox',
    description: (
      <Translate id="playground.codesandbox.description">
        CodeSandbox is a popular playground solution. Runs Docusaurus in a
        remote Docker container.
      </Translate>
    ),
  },
  {
    name: '⚡ StackBlitz 🆕',
    image: require('@site/static/img/playgrounds/stackblitz.png'),
    url: 'https://docusaurus.new/stackblitz',
    description: (
      <Translate
        id="playground.stackblitz.description"
        values={{
          webContainersLink: (
            <Link href="https://blog.stackblitz.com/posts/introducing-webcontainers/">
              WebContainers
            </Link>
          ),
        }}>
        {
          'StackBlitz uses a novel {webContainersLink} technology to run Docusaurus directly in your browser.'
        }
      </Translate>
    ),
  },
];

interface Props {
  name: string;
  image: string;
  url: string;
  description: JSX.Element;
}

function PlaygroundCard({name, image, url, description}: Props) {
  return (
    <div className="col col--6 margin-bottom--lg">
      <div className={clsx('card')}>
        <div className={clsx('card__image')}>
          <Link to={url}>
            <Image img={image} alt={`${name}'s image`} />
          </Link>
        </div>
        <div className="card__body">
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            <Link className="button button--secondary" to={url}>
              <Translate id="playground.tryItButton">Try it now!</Translate>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaygroundCardsRow(): JSX.Element {
  return (
    <div className="row">
      {Playgrounds.map((playground) => (
        <PlaygroundCard key={playground.name} {...playground} />
      ))}
    </div>
  );
}
