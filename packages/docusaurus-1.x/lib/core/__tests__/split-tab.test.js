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
const Doc = require('../Doc.js');

configure({adapter: new Adapter()});

describe('when code tabs are used correctly', () => {
  let props;
  let mountedDoc;
  const docPage = () => {
    if (!mountedDoc) {
      mountedDoc = mount(<Doc {...props} />);
    }
    return mountedDoc;
  };
  beforeEach(() => {
    props = {
      content: `
<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->
\`\`\`js
console.log('Hello, world!');
\`\`\`
<!--Python-->
\`\`\`py
print('Hello, world!')
\`\`\`

<!--C-->
\`\`\`C
#include <stdio.h>

int main() {
   printf("Hello World!");
   return 0;
}
\`\`\`

<!--Pascal-->
\`\`\`Pascal
program HelloWorld;
begin
  WriteLn('Hello, world!');
end.
\`\`\`

<!--END_DOCUSAURUS_CODE_TABS-->
      `,
      metadata: {},
      config: {},
    };
    mountedDoc = undefined;
  });
  it('renders tabs correctly', () => {
    const node = docPage().getDOMNode();
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
    const node = docPage().getDOMNode();
    const firstContent = node.querySelector('[id$="-content-7"]').textContent;
    expect("console.log('Hello, world!');\n").toEqual(firstContent);
    const secondContent = node.querySelector('[id$="-content-8"]').textContent;
    expect("print('Hello, world!')\n").toEqual(secondContent);
    const thirdContent = node.querySelector('[id$="-content-9"]').textContent;
    expect(
      '#include <stdio.h>int main() {   printf("Hello World!");   return 0;}\n',
    ).toEqual(thirdContent);
    const fourthContent = node.querySelector('[id$="-content-10"]').textContent;
    expect("program HelloWorld;begin  WriteLn('Hello, world!');end.\n").toEqual(
      fourthContent,
    );
  });
});
