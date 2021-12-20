import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';
import { AuthService } from '@app/auth/providers/auth.service';

// буду проверять, когда появится админка
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  returnUrl: string;
  error: string = '';
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['kemmer.alexandro@example.net', Validators.required],
      password: ['password', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .login({email: this.f.email.value, password: this.f.password.value})
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.error = error;
        },
      });
  }
}
