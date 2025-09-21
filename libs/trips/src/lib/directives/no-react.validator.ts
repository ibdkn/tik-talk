import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[noReact]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoReactValidator,
      multi: true
    }
  ]
})
export class NoReactValidator implements Validator {
  change!: () => void

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(control.value)

    return control.value.toLowerCase() === 'react'
      ? {noReact: {message: 'No Reacts111'}}
      : null;
  }

  registerOnValidatorChange(fn: () => void) {
    this.change = fn;
  }
}
