import { TestBed } from '@angular/core/testing';

import { OfflineActions } from './offline-actions';

describe('OfflineActions', () => {
  let service: OfflineActions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineActions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
