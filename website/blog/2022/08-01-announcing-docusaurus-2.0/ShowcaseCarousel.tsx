/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import React, {type ComponentProps} from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
} from 'pure-react-carousel';
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';
import 'pure-react-carousel/dist/react-carousel.es.css';
import styles from './ShowcaseCarousel.module.css';

type Site = {
  name: string;
  image: ComponentProps<typeof Image>['img'];
  url: string;
};

function SiteSlide({index, site}: {index: number; site: Site}) {
  return (
    <Slide index={index} className={styles.siteSlide}>
      <Image
        img={site.image}
        alt={site.name}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <Link to={site.url} className={styles.siteLink} target="_blank">
        🔗 {site.name}
      </Link>
    </Slide>
  );
}

export default function ShowcaseCarousel({
  sites,
  aspectRatio,
}: {
  sites: Site[];
  aspectRatio: number;
}): JSX.Element {
  return (
    <CarouselProvider
      naturalSlideWidth={1}
      naturalSlideHeight={1 / aspectRatio}
      totalSlides={sites.length}
      infinite
      className={styles.carousel}>
      <Slider>
        {sites.map((site, index) => (
          <SiteSlide key={index} index={index} site={site} />
        ))}
      </Slider>
      <ButtonNext className={styles.navButton} style={{right: -20}}>
        {'>'}
      </ButtonNext>
      <ButtonBack className={styles.navButton} style={{left: -20}}>
        {'<'}
      </ButtonBack>
      <DotGroup className={styles.dotGroup} />
    </CarouselProvider>
  );
}

export function ShowcaseCarouselV1(): JSX.Element {
  return (
    <ShowcaseCarousel
      aspectRatio={1072 / 584}
      sites={[
        {
          name: 'Prettier',
          image: require('./img/v1/prettier.png'),
          url: 'https://prettier.io/',
        },
        {
          name: 'Babel',
          image: require('./img/v1/babel.png'),
          url: 'https://babeljs.io/',
        },
        {
          name: 'React-Native',
          image: require('./img/v1/react-native.png'),
          url: 'https://archive.reactnative.dev/',
        },
        {
          name: 'Katex',
          image: require('./img/v1/katex.png'),
          url: 'https://katex.org/docs/',
        },
        {
          name: 'Docusaurus',
          image: require('./img/v1/docusaurus.png'),
          url: 'https://v1.docusaurus.io/',
        },
      ]}
    />
  );
}

export function ShowcaseCarouselV2(): JSX.Element {
  return (
    <ShowcaseCarousel
      aspectRatio={2148 / 1194}
      sites={[
        {
          name: 'Tauri',
          image: require('./img/v2/tauri.png'),
          url: 'https://tauri.app/',
        },
        {
          name: 'Figma',
          image: require('./img/v2/figma.png'),
          url: 'https://www.figma.com/plugin-docs/',
        },
        {
          name: 'Snapchat',
          image: require('./img/v2/snapchat.png'),
          url: 'https://docs.snap.com/',
        },
        {
          name: 'Iota',
          image: require('./img/v2/iota.png'),
          url: 'https://wiki.iota.org/',
        },
        {
          name: 'SAP Cloud',
          image: require('./img/v2/sap-cloud.png'),
          url: 'https://sap.github.io/cloud-sdk/',
        },
        {
          name: 'Supabase',
          image: require('./img/v2/supabase.png'),
          url: 'https://supabase.com/docs',
        },
        {
          name: 'StackBlitz',
          image: require('./img/v2/stackblitz.png'),
          url: 'https://developer.stackblitz.com/',
        },
        {
          name: 'Lacework',
          image: require('./img/v2/lacework.png'),
          url: 'https://docs.lacework.com/',
        },
        {
          name: 'React-Navigation',
          image: require('./img/v2/react-navigation.png'),
          url: 'https://reactnavigation.org/',
        },
        {
          name: 'Solana',
          image: require('./img/v2/solana.png'),
          url: 'https://docs.solana.com/',
        },
        {
          name: 'Gulp',
          image: require('./img/v2/gulp.png'),
          url: 'https://gulpjs.com/',
        },
      ]}
    />
  );
}

export function ShowcaseCarouselV2Theming(): JSX.Element {
  return (
    <ShowcaseCarousel
      aspectRatio={2148 / 1194}
      sites={[
        {
          name: 'Ionic',
          image: require('./img/v2-theming/ionic.png'),
          url: 'https://ionicframework.com/docs/',
        },
        {
          name: 'Outerbounds',
          image: require('./img/v2-theming/outerbounds.png'),
          url: 'https://outerbounds.com/docs/',
        },
        {
          name: 'Courier',
          image: require('./img/v2-theming/courier.png'),
          url: 'https://www.courier.com/docs/',
        },
        {
          name: 'Quickwit',
          image: require('./img/v2-theming/quickwit.png'),
          url: 'https://quickwit.io/docs/',
        },
        {
          name: 'Dyte',
          image: require('./img/v2-theming/dyte.png'),
          url: 'https://docs.dyte.io/',
        },
        {
          name: 'React-Native',
          image: require('./img/v2-theming/react-native.png'),
          url: 'https://reactnative.dev/',
        },
        {
          name: 'Hasura',
          image: require('./img/v2-theming/hasura.png'),
          url: 'https://hasura.io/docs/',
        },
        {
          name: 'Datagit',
          image: require('./img/v2-theming/datagit.png'),
          url: 'https://www.datagit.ir/',
        },
      ]}
    />
  );
}
