import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerTemplate } from './spinner-template';

describe('SpinnerTemplate', () => {
  let component: SpinnerTemplate;
  let fixture: ComponentFixture<SpinnerTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
