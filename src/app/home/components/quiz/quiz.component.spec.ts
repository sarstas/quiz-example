import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { click } from '../../../../test';
import { QuizComponent } from '@app/home/components/quiz/quiz.component';
import { QuestionService, QuestionServiceStub } from '@app/home/providers/question.service';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let questionService: QuestionService;
  let fixture: ComponentFixture<QuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [
        QuizComponent,
        MatProgressBar
      ],
      providers: [
        {
          provide: QuestionService,
          useClass: QuestionServiceStub,
        },
      ],
    });

    fixture = TestBed.createComponent(QuizComponent);
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

  fit('should send questions when the user has answered all the questions', () => {
    const spy = spyOn(questionService, 'sendAnswers').and.callThrough();

    changeCheckbox();
    clickSubmit();

    expect(spy).toHaveBeenCalled();
  });

  function getBtnEl(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }

  function getCheckboxInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('[type=checkbox]')).nativeElement;
  }

  function changeCheckbox(): void {
    const input = getCheckboxInput()

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function clickSubmit(): void {
    click(getBtnEl());
  }

});
