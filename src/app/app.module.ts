import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SelectAppComponent } from './select-app/select-app.component';
import { QuestionViewComponent } from './question-view/question-view.component';
import { HoursViewComponent } from './hours-view/hours-view.component';
import { CalcFooterComponent } from './calc-footer/calc-footer.component';
import { SummaryComponent } from './summary/summary.component';
import { CalcHeaderComponent } from './calc-header/calc-header.component';
import { PlatformStepComponent } from './platform-step/platform-step.component';
import { DesignStepComponent } from './design-step/design-step.component';
import { DynamicQuesComponent } from './dynamic-ques/dynamic-ques.component';
import { ReportComponent } from './report/report.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'report/:uid', component: ReportComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SelectAppComponent,
    QuestionViewComponent,
    HoursViewComponent,
    CalcFooterComponent,
    SummaryComponent,
    CalcHeaderComponent,
    PlatformStepComponent,
    DesignStepComponent,
    DynamicQuesComponent,
    ReportComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
