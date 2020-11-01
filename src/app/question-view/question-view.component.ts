import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {
  @Output() back = new EventEmitter<boolean>();
  @Output() completed = new EventEmitter<boolean>();
  showHr = false;
  open = true;
  constructor(public mainService: MainService) { }

  ngOnInit() {
    this.mainService.setSteps();
  }

  continue() {
    if (this.mainService.selectedTileDetail.length > 0 && this.mainService.currentStep < this.mainService.selectedTileDetail.length+2) {
      this.mainService.currentStep++;
    }
  }

  moveBackward() {
    if (this.mainService.currentStep === 1) {
      this.back.emit(true)
    } else if (this.mainService.currentStep > 1) {
      this.mainService.currentStep--;
      const stepDetail = this.mainService.getNextStepDetail();
      if (stepDetail && stepDetail.id) {
        const found = this.mainService.featuresSelected.find(fs => fs.id === stepDetail.id);
        if (found) {
          this.mainService.currentStepDetail = found;
        } else {
          this.mainService.setCurrentStepDetail();
        }
      }
      if (this.mainService.featuresSelected.length > 0 && this.mainService.currentStepDetail.id && this.mainService.featuresSelected.find(f => f.id === this.mainService.currentStepDetail.id)) {
        this.mainService.showFeatureDetail.emit(true);
      } else {
        this.mainService.showFeatureDetail.emit(false);
      }
    }
  }

}
