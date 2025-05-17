import { TestBed } from '@angular/core/testing';
import { ConstantService } from '@app/services/constant/constant.service';

describe('ConstantService', () => {
  let constantService: ConstantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConstantService],
    });
    constantService = TestBed.inject(ConstantService);
  });

  it('should be created constant service', () => {
    expect(constantService).toBeTruthy();
  });
});
