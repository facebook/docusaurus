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
import React from 'react';
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
import styles from './ShowcaseCarousel.module.css';

type Site = {
  name: string;
  image: string;
  url: string;
};

function SiteSlide({index, site}: {index: number; site: Site}) {
  return (
    <Slide index={index}>
      <img
        src={site.image}
        alt={site.name}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <div className={styles.site}>
        🔗 <Link to={site.url}>{site.name}</Link>
      </div>
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
      aspectRatio={100 / 62}
      sites={[
        {
          name: 'Prettier',
          image:
            'https://user-images.githubusercontent.com/749374/180484894-0485d3b9-0d1c-4333-aec0-6816c819da3f.png',
          url: 'https://prettier.io/',
        },
        {
          name: 'Babel',
          image:
            'https://user-images.githubusercontent.com/749374/180484926-1be22298-d167-4229-b3b7-ec699c487541.png',
          url: 'https://babeljs.io/',
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
