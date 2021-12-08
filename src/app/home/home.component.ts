import { Component, OnInit } from '@angular/core';
import { QuestionService } from '@app/_services/question.service';
import { Question } from '@app/_models';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import { AnswersQuiz } from '@app/_models/answers-quiz';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  loading: boolean = false;
  currentQuestionIdx: number;
  questions: Question[] = [];
  toServer: AnswersQuiz = { questions: [] };
  form: FormGroup;
  incorrectlyAnswer: number;

  get answersFormArray() {
    return this.form.controls.answers as FormArray;
  }

  constructor(
    private questionService: QuestionService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      // answers: new FormArray([], minSelectedCheckboxes(1)),
      answers: new FormArray([], minSelectedCheckboxes(1)),
    });
    this.getQuizAll();
  }

  submitForm(questionId: number) {
    this.loading = true;
    const selectedAnswersIds = this.form.value.answers
      .map((checked, i) =>
        checked
          ? this.questions.find((question) => question.id === questionId).answers[i].id
          : null
      )
      .filter((v) => v !== null);
    this.toServer.questions.push({
      answerIds: selectedAnswersIds,
      id: questionId,
    });
    this.form.reset();
    this.currentQuestionIdx++;

    if (this.currentQuestionIdx === this.questions.length) {
      this.questionService.sendAnswers(this.toServer).subscribe((data) => {
        this.incorrectlyAnswer = data.data.length;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  private addCheckboxes() {
    this.questions[0].answers.forEach(() =>
      this.answersFormArray.push(new FormControl(false))
    );
  }

  getQuizAll(): void {
    this.loading = true;
    this.questionService.getQuestions().subscribe((questions) => {
      this.questions = questions.data;
      this.addCheckboxes();
      this.currentQuestionIdx = 0;
      this.loading = false;
    });
  }

  retry(): void {
    this.currentQuestionIdx = 0;
    this.toServer = { questions: [] };
  }
}

function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);
    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}
