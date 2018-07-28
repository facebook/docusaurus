import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Hello from '@theme/hello';
import Layout from '@theme/layout';

class App extends React.Component {
  render() {
    // https://reacttraining.com/react-router/web/example/route-config
    const routes = [
      {
        path: '/',
        component: Hello
      },
      {
        path: '/layout',
        component: Layout
      }
    ];

    return (
      <BrowserRouter>
        <div>
          <Switch>
            {routes.map(({path, component}) => (
              <Route key={path} exact path={path} component={component} />
            ))}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
render(<App />, document.getElementById('app'));
