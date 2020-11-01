import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-design-step',
  templateUrl: './design-step.component.html',
  styleUrls: ['./design-step.component.css']
})
export class DesignStepComponent implements OnInit {
  @Output() complete = new EventEmitter<boolean>();
  constructor(public mainService: MainService) { }

  ngOnInit() {
    this.mainService.setDesignHours();
  }

  getEstimate() {
    if (this.mainService.designSelected) {
      this.complete.emit(true);
    }
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      const nextStepDetail = this.mainService.getNextStepDetail();
      if (this.mainService.featuresSelected.length > 0 && nextStepDetail && nextStepDetail.id && this.mainService.featuresSelected.find(f => f.id === nextStepDetail.id)) {
        this.mainService.showFeatureDetail.emit(true);
      } else {
        this.mainService.showFeatureDetail.emit(false);
      }
    }, 0);
  }

}
