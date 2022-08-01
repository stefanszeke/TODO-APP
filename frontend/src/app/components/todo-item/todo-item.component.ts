import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from "src/app/models/Todo";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() onClickCheck = new EventEmitter()
  @Output() onClickDelete = new EventEmitter()
  @Output() onClickEdit = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  emitClickCheck() {
    this.onClickCheck.emit(this.todo)
  }

  emitClickDelete() {
    this.onClickDelete.emit(this.todo)
  }

  emitClickEdit() {
    this.onClickEdit.emit(this.todo)
  }

}
