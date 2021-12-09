import { QuestionService, QuestionServiceStub } from '@app/_services';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '@app/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { click } from '../../test';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let questionService: QuestionService;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [
        HomeComponent,
        MatProgressBar
      ],
      providers: [
        {
          provide: QuestionService,
          useClass: QuestionServiceStub,
        },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    questionService = TestBed.inject(QuestionService);
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should called function getQuestions', () => {
    const spy = spyOn(questionService, 'getQuestions').and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  fit('should send questions when the user has answered all the questions', waitForAsync(() => {
    const spy = spyOn(questionService, 'sendAnswers').and.callThrough();

    fixture.detectChanges();

    changeInput();
    clickSubmit();
    // fixture.whenStable().then(() => {
    //
    //
    // });
    expect(spy).toHaveBeenCalled();
  }));

  function getBtnEl(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }

  function getCheckboxInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('.btn__submit')).nativeElement;
  }

  function changeInput(): void {
    const input = this.getCheckboxInput()
    input.value = true;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function clickSubmit(): void {
    click(getBtnEl());
  }

});
