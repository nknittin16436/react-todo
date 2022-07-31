import React from "react";
import Todo from "./Todo";
import { useSelector } from "react-redux";

const FilteredTodo = ({ todoStatus, handleEditTodo }) => {
  const { todos } = useSelector((state) => state.todo);
  return (
    <div>
      {todos.map(
        (todo) =>
          todo.completed === todoStatus && (
            <Todo key={todo.id} todo={todo} handleEditTodo={handleEditTodo} />
          )
      )}
    </div>
  );
};

export default FilteredTodo;
