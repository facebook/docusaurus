/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */
process.cwd = () => `${__dirname}/__fixtures__/website`;

const React = require('react');
const {configure, mount} = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const fs = require('fs');
const _ = require('lodash');
const Doc = require('../Doc.js');

configure({adapter: new Adapter()});

describe('when code tabs are used correctly', () => {
  // clear unique id counter
  _.uniqueId = _.runInContext().uniqueId;
  const props = {
    content: fs.readFileSync(
      `${__dirname}/__fixtures__/split-tab_doc1.md`,
      'utf-8',
    ),
    metadata: {},
    config: {},
  };
  let mountedDoc;
  const docPage = () => {
    if (!mountedDoc) {
      mountedDoc = mount(<Doc {...props} />);
    }
    return mountedDoc;
  };
  const page = docPage();
  it('renders tabs correctly', () => {
    const node = page.getDOMNode();
    const firstTab = node.querySelector('[data-tab$="-content-2"]').textContent;
    expect('JavaScript').toEqual(firstTab);
    const secondTab = node.querySelector('[data-tab$="-content-3"]')
      .textContent;
    expect('Python').toEqual(secondTab);
    const thirdTab = node.querySelector('[data-tab$="-content-4"]').textContent;
    expect('C').toEqual(thirdTab);
    const fourthTab = node.querySelector('[data-tab$="-content-5"]')
      .textContent;
    expect('Pascal').toEqual(fourthTab);
  });
  it('renders content correctly', () => {
    const node = page.getDOMNode();
    const firstContent = node.querySelector('[id$="-content-2"] code')
      .textContent;
    expect("console.log('Hello, world!');").toEqual(firstContent);
    const secondContent = node.querySelector('[id$="-content-3"] code')
      .textContent;
    expect("print('Hello, world!')").toEqual(secondContent);
    const thirdContent = node.querySelector('[id$="-content-4"] code')
      .textContent;
    expect(
      '#include <stdio.h>int main() {   printf("Hello World!");   return 0;}',
    ).toEqual(thirdContent);
    const fourthContent = node.querySelector('[id$="-content-5"] code')
      .textContent;
    expect("program HelloWorld;begin  WriteLn('Hello, world!');end.").toEqual(
      fourthContent,
    );
  });
});

describe('when code tab is used in a list', () => {
  // clear unique id counter
  _.uniqueId = _.runInContext().uniqueId;
  const props = {
    content: fs.readFileSync(
      `${__dirname}/__fixtures__/split-tab_doc2.md`,
      'utf-8',
    ),
    metadata: {},
    config: {},
  };
  let mountedDoc;
  const docPage = () => {
    if (!mountedDoc) {
      mountedDoc = mount(<Doc {...props} />);
    }
    return mountedDoc;
  };
  const page = docPage();
  it('renders tabs correctly', () => {
    const node = page.getDOMNode();
    const firstTab = node.querySelector('[data-tab$="-content-2"]').textContent;
    expect('JavaScript').toEqual(firstTab);
    const secondTab = node.querySelector('[data-tab$="-content-3"]')
      .textContent;
    expect('Python').toEqual(secondTab);
    const thirdTab = node.querySelector('[data-tab$="-content-4"]').textContent;
    expect('C').toEqual(thirdTab);
    const fourthTab = node.querySelector('[data-tab$="-content-5"]')
      .textContent;
    expect('Pascal').toEqual(fourthTab);
  });
  it('renders content correctly', () => {
    const node = page.getDOMNode();
    const firstContent = node.querySelector('[id$="-content-2"] code')
      .textContent;
    expect("console.log('Hello, world!');").toEqual(firstContent);
    const secondContent = node.querySelector('[id$="-content-3"] code')
      .textContent;
    expect("print('Hello, world!')").toEqual(secondContent);
    const thirdContent = node.querySelector('[id$="-content-4"] code')
      .textContent;
    expect(
      '#include <stdio.h>int main() {   printf("Hello World!");   return 0;}',
    ).toEqual(thirdContent);
    const fourthContent = node.querySelector('[id$="-content-5"] code')
      .textContent;
    expect("program HelloWorld;begin  WriteLn('Hello, world!');end.").toEqual(
      fourthContent,
    );
  });
});
