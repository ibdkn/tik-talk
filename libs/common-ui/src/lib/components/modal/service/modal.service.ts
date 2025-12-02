import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { finalize, Observable, take } from 'rxjs';
import { outputToObservable } from '@angular/core/rxjs-interop';

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

    const componentRef = this.containerRef.createComponent(component);
    const instance: any = componentRef.instance;

    if (!instance.result) return;

    return outputToObservable(instance.result).pipe(
      take(1),
      finalize(() => {
        const index = this.containerRef.indexOf(componentRef.hostView);
        if (index !== -1) {
          this.containerRef.remove(index);
        }
      })
    );
  }

  hide() {
    if (!this.containerRef) return;

    this.containerRef.clear();
  }
}
