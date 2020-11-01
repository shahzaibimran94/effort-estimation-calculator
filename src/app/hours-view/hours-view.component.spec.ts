import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursViewComponent } from './hours-view.component';

describe('HoursViewComponent', () => {
  let component: HoursViewComponent;
  let fixture: ComponentFixture<HoursViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
