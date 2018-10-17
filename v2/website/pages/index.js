import React from 'react';
import Helmet from 'react-helmet';
import Todo from '@site/components/Todo';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Todo App</title>
          <link rel="stylesheet" type="text/css" href="/css/todo.css" />
        </Helmet>
        <div className="homeContainer">
          <Todo />
        </div>
      </div>
    );
  }
}
