import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  setLoader(value: boolean): void {
    this.loadingSubject.next(value);
  }

  getLoaderValue(): boolean {
    return this.loadingSubject.getValue();
  }
}
