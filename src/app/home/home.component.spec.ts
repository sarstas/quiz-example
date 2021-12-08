import { QuestionService, QuestionServiceStub } from '@app/_services';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '@app/home/home.component';
import { MatCardModule } from '@angular/material/card';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let questionService: QuestionService;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, MatCardModule],
      declarations: [ HomeComponent ],
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

  it('should to get questions', () => {
    const spy = spyOn(questionService, 'getQuestions').and.callThrough();

    // ngOnInit();

  });

});
