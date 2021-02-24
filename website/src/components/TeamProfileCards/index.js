/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function TeamProfileCard({className, name, children, githubUrl, twitterUrl}) {
  return (
    <div className={className}>
      <div className="card card--full-height">
        <div className="card__header">
          <div className="avatar avatar--vertical">
            <img
              className="avatar__photo avatar__photo--xl"
              src={githubUrl + '.png'}
              alt={`${name}'s avatar`}
            />
            <div className="avatar__intro">
              <h3 className="avatar__name">{name}</h3>
            </div>
          </div>
        </div>
        <div className="card__body">{children}</div>
        <div className="card__footer">
          <div className="button-group button-group--block">
            {githubUrl && (
              <a className="button button--secondary" href={githubUrl}>
                GitHub
              </a>
            )}
            {twitterUrl && (
              <a className="button button--secondary" href={twitterUrl}>
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamProfileCardCol(props) {
  return (
    <TeamProfileCard {...props} className={'col col--6 margin-bottom--lg'} />
  );
}

export function ActiveTeamRow() {
  return (
    <div className="row">
      <TeamProfileCardCol
        name="Alexey Pyltsyn"
        githubUrl="https://github.com/lex111">
        Obsessed open-source enthusiast 👋 Eternal amateur at everything 🤷‍♂️
        Maintainer of Russian docs on PHP, React, Kubernetes and much more 🧐
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Joel Marcey"
        githubUrl="https://github.com/JoelMarcey"
        twitterUrl="https://twitter.com/joelmarcey">
        Docusaurus founder and now ever grateful Docusaurus cheerleader to those
        who actually write code for it.
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Sébastien Lorber"
        githubUrl="https://github.com/slorber"
        twitterUrl="https://twitter.com/sebastienlorber">
        React lover since 2014. Freelance, helping Facebook ship Docusaurus v2.
        He writes regularly, on his{' '}
        <a href="https://sebastienlorber.com/" target="_blank">
          website
        </a>{' '}
        and{' '}
        <a href="https://dev.to/sebastienlorber" target="_blank">
          Dev.to
        </a>
        .
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Yangshun Tay"
        githubUrl="https://github.com/yangshun"
        twitterUrl="https://twitter.com/yangshunz">
        Full Front End Stack developer who likes working on the Jamstack.
        Working on Docusaurus made him Facebook's unofficial part-time Open
        Source webmaster, which is an awesome role to be in.
      </TeamProfileCardCol>
    </div>
  );
}

export function HonoraryAlumniTeamRow() {
  return (
    <div className="row">
      <TeamProfileCardCol
        name="Endilie Yacop Sucipto"
        githubUrl="https://github.com/endiliey"
        twitterUrl="https://twitter.com/endiliey">
        Maintainer @docusaurus · 🔥🔥🔥
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Wei Gao"
        githubUrl="https://github.com/wgao19"
        twitterUrl="https://twitter.com/wgao19">
        🏻‍🌾 Work in progress React developer, maintains Docusaurus, writes
        docs and spams this world with many websites.
      </TeamProfileCardCol>
    </div>
  );
}

export function StudentFellowsTeamRow() {
  return (
    <div className="row">
      <TeamProfileCardCol
        name="Anshul Goyal"
        githubUrl="https://github.com/anshulrgoyal"
        twitterUrl="https://twitter.com/ar_goyal">
        Fullstack developer who loves to code and try new technologies. In his
        free time, he contributes to open source, writes blog posts on his{' '}
        <a href="https://anshulgoyal.dev/" target="_blank">
          website
        </a>{' '}
        and watches Anime.
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Drew Alexander"
        githubUrl="https://github.com/drewbi">
        Developer and Creative, trying to gain the skills to build whatever he
        can think of.
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Fanny Vieira"
        githubUrl="https://github.com/fanny"
        twitterUrl="https://twitter.com/fannyvieiira">
        Fanny got started with web development in high school, building a
        project for the school kitchen. In her free time she loves contributing
        to Open Source, occasionally writing on{' '}
        <a href="https://dev.to/fannyvieira" target="_blank">
          her blog
        </a>{' '}
        about her experiences, cooking, and creating{' '}
        <a href="https://open.spotify.com/user/anotherfanny" target="_blank">
          Spotify playlists
        </a>
        .
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Sam Zhou"
        githubUrl="https://github.com/SamChou19815"
        twitterUrl="https://twitter.com/SamChou19815">
        Sam started programming in 2011 and built his{' '}
        <a href="https://developersam.com">website</a> in 2015. He is interested
        in programming languages, dev infra and web development, and has built
        his own{' '}
        <a href="https://samlang.developersam.com/">programming language</a> and{' '}
        <a href="https://github.com/SamChou19815/mini-react">mini React</a>.
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Tan Teik Jun"
        githubUrl="https://github.com/teikjun"
        twitterUrl="https://twitter.com/teik_jun">
        Open-source enthusiast who aims to become as awesome as the other humans
        on this page. Working on Docusaurus brought him closer to his goal. 🌱
      </TeamProfileCardCol>
      <TeamProfileCardCol
        name="Nisarag Bhatt"
        githubUrl="https://github.com/FocalChord"
        twitterUrl="https://twitter.com/focalchord_">
        Fullstack web developer who loves learning new technologies and applying
        them! Loves contributing to open source as well as writing content
        articles and tutorials.
      </TeamProfileCardCol>
    </div>
  );
}
