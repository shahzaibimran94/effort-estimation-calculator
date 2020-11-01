import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAppComponent } from './select-app.component';

describe('SelectAppComponent', () => {
  let component: SelectAppComponent;
  let fixture: ComponentFixture<SelectAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
