import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgSquares } from './bg-squares';

describe('BgSquares', () => {
  let component: BgSquares;
  let fixture: ComponentFixture<BgSquares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BgSquares]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgSquares);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
