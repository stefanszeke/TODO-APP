import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Todo } from "src/app/models/Todo";
import { ApiService } from "src/app/services/todos.service";
import * as TodosActions from "src/app/store/todos/todos.actions";
import { Store } from "@ngrx/store";
import { AppState, selectTodosList } from "../../store/app.state";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {

  todos$!: Observable<Todo[]>;
  todoText: string = '';
  editMode: boolean = false
  editId?: number
  isLoggedIn:Observable<boolean>

  constructor(private apiService: ApiService, private store:Store<AppState>, private cookieService: CookieService, private router: Router) { 
    this.todos$ = this.store.select(selectTodosList);
    this.isLoggedIn = this.store.select('users', 'isLoggedIn')
  }

  ngOnInit(): void {
    this.isLoggedIn.subscribe(res => {
      if(!res) {
        this.router.navigate(['/login'])
      }
    }).unsubscribe()

    
    this.getTodos()

  }

  getTodos(): void {
    this.apiService.getTodos(+this.cookieService.get("user")).subscribe(res => {
      this.store.dispatch(TodosActions.loadTodos({todos: res}))
    })
  }

  addTodo(): void {
    if(this.todoText.length > 0) {
      this.apiService.addTodo(+this.cookieService.get("user"),this.todoText).subscribe(() => {this.getTodos(); this.todoText = ''})
    }
  }

  checkTodo(todo: Todo): void {
    this.apiService.checkTodo(todo.id).subscribe(() => this.getTodos())

  }

  deleteTodo(todo: Todo): void {
    this.apiService.deleteTodo(todo.id).subscribe(() => {this.getTodos(); this.cancelEdit()})
  }

  editTodo(todo: Todo): void {
    this.editMode = true
    this.editId = todo.id
    this.todoText = todo.text
  }

  cancelEdit() {
    this.editMode = false
    this.todoText = ''
    this.editId = undefined
  }

  updateTodo(): void {
    this.apiService.editTodo(this.editId!, this.todoText).subscribe(() => {this.getTodos(); this.editMode = false; this.todoText = ''})
  }
}
