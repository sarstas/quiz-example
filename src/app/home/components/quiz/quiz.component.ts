import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

import { Question } from '@app/home/entietis/question';
import { AnswersQuiz } from '@app/home/entietis/answers-quiz';
import { QuestionService } from '@app/home/providers/question.service';

@Component({
  selector: 'app-home',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {

  loading: boolean = false;
  questions: Question[] = [];
  toServer: AnswersQuiz = { questions: [] };
  form: FormGroup;
  _incorrect: number;
  _currentQuestionIdx: number = 0;


  get answersFormArray() {
    return this.form.controls.answers as FormArray;
  }

  get getCurrentQuestion() {
    return this.questions[this._currentQuestionIdx]?.question;
  }

  constructor(
    private questionService: QuestionService,
    private _fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.form = this._fb.group({
      answers: new FormArray([], minSelectedCheckboxes(1)),
    });
    this.getQuizAll();
    console.log(this.getCurrentQuestion)
    // console.info('created');
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
    this._currentQuestionIdx++;
  }

  private sendDataToServer() {
    if (this._currentQuestionIdx === this.questions.length) {
      this.questionService.sendAnswers(this.toServer).subscribe((data) => {
        this._incorrect = data.data.length;
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
      this._currentQuestionIdx = 0;
      this.loading = false;
    });
  }

  retry(): void {
    this._currentQuestionIdx = 0;
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
