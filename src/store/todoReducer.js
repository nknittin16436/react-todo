import { createReducer } from "@reduxjs/toolkit";
const initialState = {
    editActive:false,
    todos:[],
    inEditMode:false,
    activeTodo:0,
};

export const todoReducer = createReducer(initialState, {

    editActive: (state,) => {
        state.editActive = !state.editActive
    },
    addTodo: (state,action) => {
        state.todos = [...state.todos,action.payload]
    },
    setTodo: (state, action) => {
        // state.todos=  [...state.todos,...action.payload]
        state.todos=  action.payload
    },
    inEditMode:(state,action)=>{
        state.inEditMode=action.payload
    },
    activeTodo:(state,action)=>{
           state.activeTodo+=action.payload
    },
    activeTodoDown:(state,action)=>{
           state.activeTodo=action.payload
    },
})