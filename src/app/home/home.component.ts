import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

import { QuestionService } from '@app/_services';
import { Question } from '@app/_models/question';
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
  incorrect: number;

  get answersFormArray() {
    return this.form.controls.answers as FormArray;
  }

  constructor(
    private questionService: QuestionService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      answers: new FormArray([], minSelectedCheckboxes(1)),
    });
    this.getQuizAll();
  }

  handleSubmitForm(questionId: number) {
    this.loading = true;
    const selectedAnswersIds = this.form.value.answers
      .map((checked, i) =>
        checked
          ? this.questions.find((question) => question.id === questionId).answers[i].id
          : null
      )
      .filter((res) => res !== null);
    this.toServer.questions.push({
      id: questionId,
      answerIds: selectedAnswersIds
    });
    this.nextCardQuiz();
    this.sendDataToServer();
  }

  private nextCardQuiz() {
    this.form.reset();
    this.currentQuestionIdx++;
  }

  private sendDataToServer() {
    if (this.currentQuestionIdx === this.questions.length) {
      this.questionService.sendAnswers(this.toServer).subscribe((data) => {
        this.incorrect = data.data.length;
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

  private getQuizAll(): void {
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
