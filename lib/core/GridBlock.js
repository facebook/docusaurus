/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");
const classNames = require("classnames");

const Marked = require("./Marked.js");
const Prism = require("./Prism.js");

class GridBlock extends React.Component {
  renderBlock(block) {
    const blockClasses = classNames("blockElement", this.props.className, {
      alignCenter: this.props.align === "center",
      alignRight: this.props.align === "right",
      fourByGridBlock: this.props.layout === "fourColumn",
      imageAlignBottom:
        (block.image || block.code) && block.imageAlign === "bottom",
      imageAlignSide:
        (block.image || block.code) &&
        (block.imageAlign === "left" || block.imageAlign === "right"),
      imageAlignTop: (block.image || block.code) && block.imageAlign === "top",
      threeByGridBlock: this.props.layout === "threeColumn",
      twoByGridBlock: this.props.layout === "twoColumn"
    });

    const topLeftContent =
      (block.imageAlign === "top" || block.imageAlign === "left") &&
      this.renderContent(block);

    const bottomRightContent =
      (block.imageAlign === "bottom" || block.imageAlign === "right") &&
      this.renderContent(block);

    return (
      <div className={blockClasses} key={block.title}>
        {topLeftContent}
        <div className="blockContent">
          {this.renderBlockTitle(block.title)}
          <Marked>
            {block.content}
          </Marked>
        </div>
        {bottomRightContent}
      </div>
    );
  }

  renderContent(block) {
    if (block.code) {
      return this.renderCodeBlock(block.code);
    } else if (block.image) {
      return this.renderBlockImage(block.image, block.imageLink);
    }
  }

  renderCodeBlock(code) {
    if (code) {
      return (
        <div className="blockCode">
          <Prism style={{ textAlign: "left" }}>
            {code}
          </Prism>
        </div>
      );
    }
  }

  renderBlockImage(image, imageLink) {
    if (image) {
      if (imageLink) {
        return (
          <div className="blockImage">
            <a href={imageLink}>
              <img src={image} />
            </a>
          </div>
        );
      } else {
        return (
          <div className="blockImage">
            <img src={image} />
          </div>
        );
      }
    } else {
      return null;
    }
  }

  renderBlockTitle(title) {
    if (title) {
      return (
        <h2>
          <Marked>
            {title}
          </Marked>
        </h2>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="gridBlock">
        {this.props.contents.map(this.renderBlock, this)}
      </div>
    );
  }
}

GridBlock.defaultProps = {
  align: "left",
  contents: [],
  imageAlign: "top",
  layout: "twoColumn"
};

module.exports = GridBlock;
