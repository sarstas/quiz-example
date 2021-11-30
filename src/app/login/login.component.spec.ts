import { LoginComponent } from '@app/login/login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthServiceStub } from '@app/_services';
import { By } from '@angular/platform-browser';
import {DebugElement} from "@angular/core";
import {RouterModule} from "@angular/router";
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
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
      ],
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

    form = fixture.debugElement.query((By.css('form')))
    passwordInputEl = fixture.debugElement.query(By.css('input[type=password]'));
    emailInputEl = fixture.debugElement.query(By.css('input[type=email]'));
    btnEl = fixture.debugElement.query(By.css('button'));

    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it( "shouldn't, send message if one of the fields empty", () => {
    const spy = spyOn(authService, 'login').and.callThrough();
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();
    form.triggerEventHandler('ngSubmit', null);
    expect(spy).not.toHaveBeenCalled();
  })

  it('should send form', () => {
    const spy = spyOn(authService, 'login').and.callThrough();
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('123456');
    fixture.detectChanges();
    form.triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalled();
  });

  it("can't press the button while the fields are empty", () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(btnEl.nativeElement.disabled).toBeFalsy();
  })

});
