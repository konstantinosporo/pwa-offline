import { TestBed } from '@angular/core/testing';

import { Update } from './update';

describe('Update', () => {
  let service: Update;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Update);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
