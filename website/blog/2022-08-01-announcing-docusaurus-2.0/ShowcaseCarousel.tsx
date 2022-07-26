/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ComponentProps} from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';
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
          image: require('./img/v1/prettier-border.png'),
          url: 'https://prettier.io/',
        },
        {
          name: 'Babel',
          image: require('./img/v1/babel-border.png'),
          url: 'https://babeljs.io/',
        },
        {
          name: 'React-Native',
          image: require('./img/v1/react-native-border.png'),
          url: 'https://archive.reactnative.dev/',
        },
        {
          name: 'Katex',
          image: require('./img/v1/katex-border.png'),
          url: 'https://katex.org/docs/',
        },
        {
          name: 'Docusaurus',
          image: require('./img/v1/docusaurus-border.png'),
          url: 'https://v1.docusaurus.io/',
        },
      ]}
    />
  );
}

export function ShowcaseCarouselV2(): JSX.Element {
  return (
    <ShowcaseCarousel
      aspectRatio={100 / 62}
      sites={[
        {
          name: 'React-Native',
          image:
            'https://user-images.githubusercontent.com/749374/180420765-11009bec-525f-4ad2-a2a6-33d82f0739bf.png',
          url: 'https://reactnative.dev/',
        },
        {
          name: 'Ionic',
          image:
            'https://user-images.githubusercontent.com/749374/180421278-e0636886-4350-4cd6-9545-8708e39e80c6.png',
          url: 'https://ionicframework.com/docs/',
        },
        {
          name: 'Courier',
          image:
            'https://user-images.githubusercontent.com/749374/180422160-bf3b9b10-b7ac-4bac-b337-918f2b0ab842.png',
          url: 'https://www.courier.com/docs',
        },
        {
          name: 'Quickwit',
          image:
            'https://user-images.githubusercontent.com/749374/180422673-c2175d7a-7c82-4fd5-a17d-99f8c1adbb41.png',
          url: 'https://quickwit.io/docs/',
        },
      ]}
    />
  );
}
