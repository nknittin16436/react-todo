import React, { useState, useCallback, useEffect} from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import "./Todo.css";
import { useDispatch, useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";

const Todo = ({ todo, handleEditTodo }) => {
  const [edit, setEdit] = useState(false);
  const [prevTodo, setPrevTodo] = useState(todo.title);
  const [editedTodo, setEditedTodo] = useState(todo.title);
  const { inEditMode } = useSelector((state) => state.todo);
  const [showCLear, setShowCLear] = useState(false);
  const dispatch = useDispatch();

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      setPrevTodo(editedTodo);
      setEditedTodo(editedTodo);
      dispatch({ type: "inEditMode", payload: false });
      setEdit(false);
    }
  }, []);

  const handleEditSubmit = (event) => {
    event.preventDefault();
    handleEdit();
    // console.log(prevTodo);
    handleEditTodo(prevTodo, todo.id, todo.completed);
    dispatch({ type: "inEditMode", payload: false });

    // console.log("Enter on Edit Text");
  };


  const handleEdit = () => {
    setEdit((prev) => !prev);
    dispatch({ type: "inEditMode", payload: true });
  };

  const deleteTodo = () => {
    handleEditTodo("", todo.id, todo.completed);
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction]);

  return (
    <div
      className="todoItem"
      onMouseOver={() => setShowCLear(true)}
      onMouseOut={() => setShowCLear(false)}
    >
      {!edit ? (
        todo.completed ? (
          <CheckCircleOutlineOutlinedIcon
            className="check-icon check-icon-done"
            onClick={() => {
              handleEditTodo(prevTodo, todo.id, false);
              dispatch({ type: "activeTodo", payload: 1 });
            }}
          />
        ) : (
          <CircleOutlinedIcon
            className="check-icon"
            onClick={() => {
              handleEditTodo(prevTodo, todo.id, true);
              dispatch({ type: "activeTodo", payload: -1 });
            }}
          />
        )
      ) : (
        ""
      )}
      {!edit ? (
        <p
          onDoubleClick={() => {
            if (!inEditMode) {
              handleEdit();
            }
          }}
          className={todo.completed ? "completed" : ""}
        >
          {todo.title}
        </p>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            id={`todo${todo.id}`}
            className="edit-todo-input"
            type="text"
            autoFocus
            value={prevTodo}
            onChange={(e) => setPrevTodo(e.target.value)}
            onBlur={handleEditSubmit}
          />
        </form>
      )}
      {!edit && (
        <ClearIcon
          id="clear-icon"
          className={showCLear ? "show" : "hide"}
          onClick={deleteTodo}
        />
      )}
    </div>
  );
};

export default Todo;
