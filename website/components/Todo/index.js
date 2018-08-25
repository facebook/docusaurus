import React from 'react';
import Helmet from 'react-helmet';
import TodoList from './TodoList';

const ENTER_KEY = 13;

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

const todos = [
  {
    id: 'ed0bcc48-bbbe-5f06-c7c9-2ccb0456ceba',
    title: 'Build this Todo App.',
    completed: true
  },
  {
    id: '42582304-3c6e-311e-7f88-7e3791caf88c',
    title: '?????',
    completed: true
  },
  {
    id: '1cf63885-5f75-8deb-19dc-9b6765deae6c',
    title: '1,000 stars on GitHub.',
    completed: false
  },
  {
    id: '63a871b2-0b6f-4427-9c35-304bc680a4b7',
    title: 'Write a popular medium post.',
    completed: false
  },
  {
    id: '63a871b2-0b6f-4422-9c35-304bc680a4b7',
    title: 'Earn money through open source work.',
    completed: false
  },
  {
    id: '036af7f9-1181-fb8f-258f-3f06034c020f',
    title: 'Write a blog post.',
    completed: false
  }
];

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: null,
      newTodo: '',
      todos: todos
    };
  }

  handleChange(event) {
    this.setState({newTodo: event.target.value});
  }

  handleNewTodoKeyDown(event) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.newTodo.trim();

    if (val) {
      this.setState({
        todos: this.state.todos.concat({
          id: uuid(),
          title: val,
          completed: false
        }),
        newTodo: ''
      });
    }
  }

  toggleAll(event) {
    const {checked} = event.target;
    this.setState({
      todos: this.state.todos.map(todo =>
        Object.assign({}, todo, {completed: checked})
      )
    });
  }

  toggle(todoToToggle) {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo === todoToToggle) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          });
        }
        return todo;
      })
    });
  }

  destroy(passedTodo) {
    this.setState({
      todos: this.state.todos.filter(todo => todo !== passedTodo)
    });
  }

  edit(todo) {
    this.setState({editing: todo.id});
  }

  save(todoToSave, text) {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo === todoToSave) {
          return Object.assign({}, todo, {
            title: text
          });
        }
        return todo;
      }),
      editing: null
    });
  }

  cancel() {
    this.setState({editing: null});
  }

  clearCompleted() {
    this.setState({
      todos: this.state.todos.filter(todo => !todo.completed)
    });
  }

  render() {
    let main;
    const {todos} = this.state;

    const activeTodoCount = todos.reduce(
      (accum, todo) => (todo.completed ? accum : accum + 1),
      0
    );

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            <TodoList
              todos={todos}
              onToggle={todo => {
                this.toggle(todo);
              }}
              onDestroy={todo => {
                this.destroy(todo);
              }}
              onEdit={todo => {
                this.edit(todo);
              }}
              editing={todo => this.state.editing === todo.id}
              onSave={(todo, text) => {
                this.save(todo, text);
              }}
              onCancel={() => this.cancel()}
            />
          </ul>
        </section>
      );
    }

    return (
      <div className="todoapp">
        <Helmet>
          <title>Todo App</title>
          <link rel="stylesheet" type="text/css" href="/css/todo.css" />
        </Helmet>
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={event => {
              this.handleNewTodoKeyDown(event);
            }}
            onChange={event => {
              this.handleChange(event);
            }}
            autoFocus
          />
        </header>
        {main}
      </div>
    );
  }
}

export default TodoApp;
