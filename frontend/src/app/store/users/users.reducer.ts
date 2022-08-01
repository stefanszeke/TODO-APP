import { createReducer, on } from "@ngrx/store";
import { Todo } from "src/app/models/Todo";
import * as UsersActions from "./users.actions";

export interface UsersState {
  name: string;
  userId: number | null;
  isLoggedIn: boolean;
}

export const initialState: UsersState = {
  name: '',
  userId: null,
  isLoggedIn: false
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUser, (state, action) => ({
    ...state,
    name: action.name,
    userId: action.userId
  }))
)