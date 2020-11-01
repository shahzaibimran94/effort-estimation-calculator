import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQuesComponent } from './dynamic-ques.component';

describe('DynamicQuesComponent', () => {
  let component: DynamicQuesComponent;
  let fixture: ComponentFixture<DynamicQuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
