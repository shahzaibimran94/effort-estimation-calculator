import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-calc-footer',
  templateUrl: './calc-footer.component.html',
  styleUrls: ['./calc-footer.component.css']
})
export class CalcFooterComponent implements OnInit {
  @Input() platform;
  @Input() features;
  @Output() toggleView = new EventEmitter<boolean>();
  open = true;
  constructor(private mainService: MainService) { }

  ngOnInit() {
  }

  removeFeature(feature_id: number): void {
    this.mainService.minusHoursOnFeatureRemove(feature_id);
    this.mainService.featureRemoved.emit(feature_id);
  }

  toggle() {
    this.open = !this.open;
    this.toggleView.emit(this.open);
  }

  gotoStep1() {
    this.mainService.currentStep = 1;
  }

  gotoFeatureStep(selected_feature: any) {
    const index = this.mainService.selectedTileDetail.findIndex(std => std.id == selected_feature.id);
    if (index > -1) {
      this.mainService.currentStep = index + 2;
      this.mainService.currentStepDetail = selected_feature;
      setTimeout(() => {
        this.mainService.showFeatureDetail.emit(true);
      }, 0);
    }
  }

}
