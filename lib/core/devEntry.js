import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import blogMetadata from '@generated/blogMetadata';
import docsMetadata from '@generated/docsMetadata';
import Blog from './blog';
import Docs from './docs';

const renderBlog = props => {
  const metadata = blogMetadata.find(blog => blog.path === props.match.path);
  return <Blog content={metadata.content} {...props} />;
};
const renderDocs = props => {
  const metadata = docsMetadata.find(doc => doc.path === props.match.path);
  return <Docs content={metadata.content} {...props} />;
};

const Home = () => {
  const showLink = path => (
    <li>
      <Link to={path}>{path}</Link>
    </li>
  );
  const blogLinks = blogMetadata.map(blog => showLink(blog.path));
  const docsLinks = docsMetadata.map(doc => showLink(doc.path));

  return (
    <ul>
      {'Available Routes'}
      {blogLinks}
      {docsLinks}
    </ul>
  );
};

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            {blogMetadata.map(({path, content}) => (
              <Route key={path} exact path={path} render={renderBlog} />
            ))}
            {docsMetadata.map(({path}) => (
              <Route key={path} exact path={path} render={renderDocs} />
            ))}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
render(<App />, document.getElementById('app'));
