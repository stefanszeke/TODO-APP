import { createAction, props } from "@ngrx/store";
import { Todo } from "src/app/models/Todo";

export const loadTodos = createAction("[Todos] Load Todos", props<{ todos: Todo[] }>());