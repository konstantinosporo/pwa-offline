import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataTemplate } from './no-data-template';

describe('NoDataTemplate', () => {
  let component: NoDataTemplate;
  let fixture: ComponentFixture<NoDataTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoDataTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDataTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
