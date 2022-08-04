import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Todo } from "src/app/models/Todo";
import { ApiService } from "src/app/services/todos.service";
import * as TodosActions from "src/app/store/todos/todos.actions";
import { Store } from "@ngrx/store";
import { AppState, selectTodosList } from "../../store/app.state";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { faFilePen } from "@fortawesome/free-solid-svg-icons"


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


  view:[number,number]=[200,200]
  chartData:any = []
  chartColors:any = [{name: 'Completed', value: '#50C878'}, {name: 'Not completed', value: '#B84258'}]
  completed!:boolean
  chartText:string = '%'
  empty!:boolean

  faFilePen = faFilePen

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

    this.todos$.subscribe(res => {
      this.chartData = [
        {name: 'Completed', value: res.filter(todo => todo.isDone).length},
        {name: 'Not completed', value: res.filter(todo => !todo.isDone).length},
      ]
      this.completed = res.filter(todo => todo.isDone).length === res.length && res.length > 0
      this.chartText = ((res.length - res.filter(todo => !todo.isDone).length)*(100/res.length)).toFixed(0) + '%'
      this.empty = res.length > 0 ? false : true
      
    })
  
    this.getTodos()
  }

  getTodos(): void {
    this.apiService.getTodos().subscribe(res => {
      this.store.dispatch(TodosActions.loadTodos({todos: res}))
    })
  }

  addTodo(): void {
    if(this.todoText.length > 0) {
      this.apiService.addTodo(this.todoText).subscribe(() => {this.getTodos(); this.todoText = ''})
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
