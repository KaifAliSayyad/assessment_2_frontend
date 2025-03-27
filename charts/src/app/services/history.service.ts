import { Injectable } from '@angular/core';
import { History } from '../interfaces/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  history: History = {
    id:  0,
    stockId: 0,
    history: {}
  };

  constructor() { }

  getHistory() {
    return this.history;
  }

  setHistory(history: History) {
    this.history = history;
  }

  clearHistory() {
    this.history = {
      id:  0,
      stockId: 0,
      history: {}
    }
  }

}
