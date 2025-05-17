import { TestBed } from '@angular/core/testing';
import { LoaderService } from '@app/services/loader/loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should initially have loader value as false', () => {
    expect(service.getLoaderValue()).toBeFalse();
  });

  it('should set loader value to true', () => {
    service.setLoader(true);
    expect(service.getLoaderValue()).toBeTrue();
  });

  it('should set loader value to false', () => {
    service.setLoader(false);
    expect(service.getLoaderValue()).toBeFalse();
  });

  it('should emit loader changes through the observable', (done) => {
    service.loading$.subscribe((value) => {
      if (value === true) {
        expect(value).toBeTrue();
        done();
      }
    });
    service.setLoader(true);
  });
});
