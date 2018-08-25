import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList(props) {
  const todoItems = props.todos.map(todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={() => {
        props.onToggle(todo);
      }}
      onDestroy={() => {
        props.onDestroy(todo);
      }}
      onEdit={() => {
        props.onEdit(todo);
      }}
      editing={props.editing(todo)}
      onSave={text => {
        props.onSave(todo, text);
      }}
      onCancel={() => {
        props.onCancel();
      }}
    />
  ));

  return <div>{todoItems}</div>;
}
