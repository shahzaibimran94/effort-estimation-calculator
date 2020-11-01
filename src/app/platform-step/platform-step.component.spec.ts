import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformStepComponent } from './platform-step.component';

describe('PlatformStepComponent', () => {
  let component: PlatformStepComponent;
  let fixture: ComponentFixture<PlatformStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
