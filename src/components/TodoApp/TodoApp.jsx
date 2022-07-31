import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Todo from "../Todo/Todo";
import uuid from "react-uuid";
import { useDispatch, useSelector } from "react-redux";

import "./TodoApp.css";
import FilteredTodo from "../Todo/FilteredTodo";
const TodoApp = () => {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");
  const { todos } = useSelector((state) => state.todo);
  const [initial, setInitial] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [downArrowStatus, setDownArrowStatus] = useState(false);
  const { activeTodo } = useSelector((state) => state.todo);


  const handleEditTodo = (editedTitle, editedId, editedCompleted) => {
    // console.log("Received", editedTitle, editedId, editedCompleted);
    const index = todos.findIndex((todo) => todo.id === editedId);
    let todosEdited = [...todos];
    if (editedTitle === "") {
      todosEdited.splice(index, 1);
      saveEditedTodos(todosEdited);
    } else {
      const editedTodo = {
        id: editedId,
        title: editedTitle,
        completed: editedCompleted,
      };
      todosEdited.splice(index, 1, editedTodo);
      todosEdited= [...new Map(todosEdited.map(todoEdited => [JSON.stringify([todoEdited.title]), todoEdited])).values()]
      saveEditedTodos(todosEdited);
    }
  };

  const saveEditedTodos = (todosEdited) => {
    dispatch({ type: "setTodo", payload: todosEdited });
    localStorage.setItem("react-todos", JSON.stringify(todosEdited));
  };
  const createTodo = () => {
    const todo = {
      id: uuid(),
      title: newTodo,
      completed: false,
    };
    localStorage.setItem("react-todos", JSON.stringify([...todos, todo]));
    dispatch({ type: "addTodo", payload: todo });
    dispatch({ type: "activeTodo", payload: 1 });

  };


  const handleNewTodoSubmit = async (e) => {
    e.preventDefault();
    if (newTodo === "" || newTodo.trim() === '') {
      setNewTodo("");
      return;
    }


    for(let todo of todos){
      if(todo.title===newTodo){
        alert("Task alredy exist");
        return;
      }
    }
    createTodo();
    setNewTodo("");
  };

  // FUNCTION TO FETCH ALL THE TODOS FROM localStorage
  const getTodos = () => {
    const todos = localStorage.getItem("react-todos");
    if (todos === undefined) {
      localStorage.removeItem("react-todos");
      return;
    }
    const todosParsed = JSON.parse(todos);
    if (todosParsed !== null) {
      let activeCount = 0;
      todosParsed.forEach((todo) => {
        if (todo.completed === false) {
          activeCount++;
        }
      });
      dispatch({ type: "setTodo", payload: todosParsed });
      dispatch({ type: "activeTodo", payload: activeCount });
      setDownArrowStatus((prev) => !prev);
    }
  };

  // FUNCTION TO CLEAR ALL TODO WHICH ARE MARKED AS COMPLETED
  const clearCompleted = () => {
    const editedTodos = todos.filter((todo) => todo.completed === false);
    saveEditedTodos(editedTodos);
  };

  const handleDownIconClick = () => {
    setDownArrowStatus((prev) => !prev);
    let selectedTodos = todos;
    let newTodos;
    if (downArrowStatus) {
      newTodos = selectedTodos.map((todo) => {
        return { ...todo, completed: downArrowStatus };
      });
    dispatch({ type: "activeTodoDown", payload: 0 });

    } else {

      newTodos = selectedTodos.map((todo) => {
        return { ...todo, completed: downArrowStatus };
      });
    dispatch({ type: "activeTodoDown", payload: newTodos.length });

    }
    saveEditedTodos(newTodos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section id="todo-hero">
      <h1>todos</h1>
      <div className="todo-app">
        <header>
          <div className="new-todo">
            <KeyboardArrowDownIcon
              id="icon"
              className={
                downArrowStatus ? "icon--completed" : "icon--incomplete"
              }
              onClick={() => {
                handleDownIconClick();
              }}
            />
            <form onSubmit={handleNewTodoSubmit}>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </form>
          </div>
        </header>
        <section>
          {initial &&
            todos.map((todo) => (
              <Todo todo={todo} key={todo.id} handleEditTodo={handleEditTodo} />
            ))}

          {!initial && (
            <FilteredTodo todoStatus={toggle} handleEditTodo={handleEditTodo} />
          )}
        </section>
        {todos.length > 0 && (
          <footer>
            <div id="todo-app__footer">
              <span>{`${activeTodo} task remaining`}</span>
              <ul>
                <a
                  onClick={() => {
                    setInitial(true);
                  }}
                >
                  All
                </a>
                <a
                  onClick={() => {
                    setInitial(false);
                    setToggle(false);
                  }}
                >
                  Active
                </a>
                <a
                  onClick={() => {
                    setInitial(false);
                    setToggle(true);
                  }}
                >
                  Completed
                </a>
              <a onClick={clearCompleted}>Clear completed</a>
              </ul>

            </div>
          </footer>
        )}
      </div>


      <p className="todo-hero__footer">Enter to add a Todo</p>
      <p className="todo-hero__footer">Double click to edit a Todo</p>
      <p className="todo-hero__footer" >Created by <a href="https://www.nandkumar.me/" target="_blank">Nand Kumar</a></p>
    </section>
  );
};

export default TodoApp;
