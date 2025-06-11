import { TestBed } from '@angular/core/testing';

import { LavajatosService } from './lavajatos.service';

describe('Lavajatos', () => {
  let service: LavajatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LavajatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
