import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcFooterComponent } from './calc-footer.component';

describe('CalcFooterComponent', () => {
  let component: CalcFooterComponent;
  let fixture: ComponentFixture<CalcFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
