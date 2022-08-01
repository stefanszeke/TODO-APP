import { createReducer, on } from "@ngrx/store";
import { Todo } from "src/app/models/Todo";
import * as TodosActions from "./todos.actions";

export interface TodosState {
  todos: Todo[];
}

export const initialState: TodosState = {
  todos: []
};

export const todosReducer = createReducer(
  initialState,
  on(TodosActions.loadTodos, (state, action) => ({
    ...state,
    todos: action.todos
  }))
)