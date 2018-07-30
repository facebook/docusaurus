import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import BlogPost from './blogPost';
import blogDatas from '@generated/blogDatas';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            {blogDatas.map(({path}) => (
              <Route key={path} exact path={path} component={BlogPost} />
            ))}
          </Switch>
          <div>
            {blogDatas.map(({path}) => {
              return (
                <div key={path}>
                  <Link to={path}>
                    {path}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
render(<App />, document.getElementById('app'));
