import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignStepComponent } from './design-step.component';

describe('DesignStepComponent', () => {
  let component: DesignStepComponent;
  let fixture: ComponentFixture<DesignStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
