import { Operation } from './operation.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoOperationsStack {
  operations;
  constructor() {
    this.operations = [];
  }

  push(operation: Operation) {
    this.operations.push(operation);
  }

  pop() {
    if (this.operations.length === 0) {
      return 'underflow';
    }
    this.operations.pop();
  }

  peek() {
    if (this.operations.length === 0) {
      return null;
    }
    return this.operations[this.operations.length - 1];
  }
}
