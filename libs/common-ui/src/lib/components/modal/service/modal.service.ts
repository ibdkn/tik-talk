import { Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private containerRef!: ViewContainerRef;

  registerContainer(viewRef: ViewContainerRef) {
    this.containerRef = viewRef;
  }

  show<T>(component: Type<T>) {
    if (!this.containerRef) return;

    this.containerRef.clear();

    this.containerRef.createComponent(component);
  }
}
