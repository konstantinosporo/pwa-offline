import { TestBed } from '@angular/core/testing';

import { Neon } from './neon';

describe('Neon', () => {
  let service: Neon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Neon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
