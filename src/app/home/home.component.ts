import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  @Output() selected = new EventEmitter<string>(); 
  constructor() { }

  choose(appType: string): void {
    this.selected.emit(appType);
  }
}
