import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcHeaderComponent } from './calc-header.component';

describe('CalcHeaderComponent', () => {
  let component: CalcHeaderComponent;
  let fixture: ComponentFixture<CalcHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
