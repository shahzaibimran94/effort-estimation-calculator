import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-platform-step',
  templateUrl: './platform-step.component.html',
  styleUrls: ['./platform-step.component.css']
})
export class PlatformStepComponent implements OnInit {

  constructor(public mainService: MainService) { }

  ngOnInit() {
  }

  continue() {
    if (this.mainService.platformSelected)
      this.mainService.currentStep = this.mainService.currentStep + 1;
    setTimeout(() => {
      const nextStepDetail = this.mainService.getNextStepDetail();
      if (this.mainService.featuresSelected.length > 0 && nextStepDetail.id && this.mainService.featuresSelected.find(f => f.id === nextStepDetail.id)) {
        this.mainService.showFeatureDetail.emit(true);
      } else {
        this.mainService.showFeatureDetail.emit(false);
      }
    }, 0);
    this.mainService.updateHrs();
  }

}
