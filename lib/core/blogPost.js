const React = require('react');
import blogDatas from '@generated/blogDatas';

// inner blog component for the article itself, without sidebar/header/footer
class BlogPost extends React.Component {
  render() {
    const {match} = this.props;
    const post = blogDatas.find(blog => blog.path === match.path);
    return <div className="post">{post && post.content}</div>;
  }
}

module.exports = BlogPost;
