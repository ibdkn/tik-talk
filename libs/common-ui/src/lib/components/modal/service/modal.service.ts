import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private containerRef!: ViewContainerRef;
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this._isOpen$.asObservable();

  registerContainer(viewRef: ViewContainerRef) {
    this.containerRef = viewRef;
  }

  show<T>(component: Type<T>) {
    if (!this.containerRef) return;

    this.containerRef.clear();

    this.containerRef.createComponent(component);

    this._isOpen$.next(true);
  }
}
