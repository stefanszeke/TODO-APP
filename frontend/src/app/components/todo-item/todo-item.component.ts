import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from "src/app/models/Todo";
import { faPen,faXmark} from "@fortawesome/free-solid-svg-icons"
import { faSquare, faSquareCheck, } from "@fortawesome/free-regular-svg-icons"
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"

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
  @Output() onClickUp = new EventEmitter()
  @Output() onClickDown = new EventEmitter()

  faPen = faPen
  faXmark = faXmark
  faSquare = faSquare
  faSquareCheck = faSquareCheck
  faAngleUp = faAngleUp
  faAngleDown = faAngleDown

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

  emitClickUp() {
    this.onClickUp.emit(this.todo)
  }

  emitClickDown() {
    this.onClickDown.emit(this.todo)
  }

}
