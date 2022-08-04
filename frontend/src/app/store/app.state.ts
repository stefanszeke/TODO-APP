import { createSelector } from "@ngrx/store";
import { TodosState } from "./todos/todos.reducer";
import { UsersState } from "./users/users.reducer";

export interface AppState {
  todos: TodosState;
  users: UsersState;
}

export const selectTodos = (state: AppState) => state.todos;

export const selectTodosList = createSelector(
  selectTodos, (todos) => todos.todos
)

export const selectIsDoneTodos = createSelector(
  selectTodosList, (todos) => todos.filter(todo => todo.isDone)
)