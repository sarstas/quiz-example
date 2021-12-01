import { LoginComponent } from '@app/login/login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthServiceStub } from '@app/_services';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {click} from "../../test";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let fixture: ComponentFixture<LoginComponent>;

  let form: DebugElement;
  let passwordInputEl: DebugElement;
  let emailInputEl: DebugElement;
  let btnEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceStub,
        },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    form = fixture.debugElement.query(By.css('form'));
    passwordInputEl = fixture.debugElement.query(
      By.css('[formControlName="password]')
    );
    emailInputEl = fixture.debugElement.query(By.css('input[type=email]'));
    btnEl = fixture.debugElement.query(By.css('button'));

    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should send form', () => {
    const spy = spyOn(authService, 'login').and.callThrough();
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();

    click(getBtnEl());
    expect(spy).toHaveBeenCalled();
  });

  it('shouldn\'t, send message if one of the fields empty', () => {
    const spy = spyOn(authService, 'login').and.callThrough();
    changeInput('', getEmailInput());
    changeInput('', getPassInput());
    clickSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  function getBtnEl(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }

  function getEmailInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('[formControlName=email]')).nativeElement;
  }

  function getPassInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('[formControlName=password]')).nativeElement;
  }

  function clickSubmit(): void {
    click(getBtnEl());
  }

  function changeInput(value: string, htmlEl: HTMLInputElement): void {
    const input: HTMLInputElement = htmlEl;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
});

