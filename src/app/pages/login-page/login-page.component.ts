import {Component, inject, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Login} from '../../data/interfaces/login.interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isPasswordVisible: WritableSignal<boolean> = signal<boolean>(false);

  form: FormGroup = new FormGroup<{ username: FormControl<string>; password: FormControl<string> }>({
    username: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  })

  onSubmit(): void {
    console.log(this.form.value)
    if (this.form.valid) {
      this.authService.login(this.form.value)
        .subscribe(val => {
          this.router.navigate(['/'])
        })
    }
  }
}
