import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-calc-header',
  templateUrl: './calc-header.component.html',
  styleUrls: ['./calc-header.component.css']
})
export class CalcHeaderComponent implements OnInit {
  @Output() back = new EventEmitter<boolean>();
  @Input() steps;
  @Input() currentStep;
  constructor() { }

  ngOnInit() {
  }

  moveBackward() {
    this.back.emit(true)
  }

}
