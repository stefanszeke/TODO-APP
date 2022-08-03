import { createAction, props } from "@ngrx/store";


export const loadUser = createAction("[LOGIN] LOAD USER FROM COOKIE", props<{ name: string, isLoggedIn: boolean }>());

