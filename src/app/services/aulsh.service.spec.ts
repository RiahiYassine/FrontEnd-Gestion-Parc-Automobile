import { TestBed } from '@angular/core/testing';

import { AulshService } from './aulsh.service';

describe('AulshService', () => {
  let service: AulshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AulshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
