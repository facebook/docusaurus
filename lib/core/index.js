import React from 'react';
import {render} from 'react-dom';
import theme from '@theme';

class App extends React.Component {
  render() {
    return <div>Hello world! {theme()} </div>;
  }
}
render(<App />, document.getElementById('app'));
