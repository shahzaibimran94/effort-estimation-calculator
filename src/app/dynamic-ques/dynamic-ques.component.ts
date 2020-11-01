import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-ques',
  templateUrl: './dynamic-ques.component.html',
  styleUrls: ['./dynamic-ques.component.css']
})
export class DynamicQuesComponent implements OnInit {
  decision: boolean;
  subscription: Subscription;
  subscription2: Subscription;
  constructor(public mainService: MainService) { }

  ngOnInit() {
    const stepDetail = this.mainService.getNextStepDetail();
    const found: any = this.mainService.featuresSelected.find(fs => fs.id === stepDetail.id);
    if (found) {
      this.mainService.currentStepDetail = found;
      this.mainService.updateHrs(found.id);
    } else {
      this.mainService.setCurrentStepDetail();
    }
    this.mainService.calculateNonDevHours();
    this.subscription = this.mainService.featureRemoved.subscribe(
      id => {
        if (this.mainService.currentStepDetail.id === id)
          this.decision = false;
      }
    );
    this.subscription2 = this.mainService.showFeatureDetail.subscribe(
      res => {
        this.decision = res;
      }
    );
  }

  selectFeature(response: boolean): void {
    if (response) {
      this.decision = response;
      if (!this.mainService.featuresSelected.find(f => f.id == this.mainService.currentStepDetail.id)) {
        this.mainService.featuresSelected.push(this.mainService.currentStepDetail);
        this.mainService.devHours = this.mainService.devHours + this.mainService.currentStepHours;
        this.mainService.calculateNonDevHours();
      }
    } else {
      this.moveNext();
    }
  }

  moveNext(): void {
    this.decision = false;
    this.mainService.currentStep = this.mainService.currentStep + 1;
    this.mainService.setCurrentStepDetail();
    if (this.mainService.currentStepDetail && this.mainService.currentStepDetail.id) {
      const selectedFeature = this.mainService.featuresSelected.find(f => f.id === this.mainService.currentStepDetail.id);
      if (selectedFeature) {
        this.decision = true;
        this.mainService.currentStepDetail = selectedFeature;
      }
    }
  }

  addOrRemove(feature_id, apply): void {
    this.mainService.addOrRemoveSubFeature(feature_id, apply);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }

}
