import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
// лишние пустые строки в импортах исключить
import { Question } from '@app/home/entietis/question';
import { AnswersQuiz } from '@app/home/entietis/answers-quiz';
import { QuestionService } from '@app/home/providers/question.service';
import { MyValidators } from '../../../shared/validators/my.validators'

/**
 * Нужна фича возврата к пред вопросу с моим ответом
 */
@Component({
  selector: 'app-home', // почему селектор app-home!?
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {

  loading: boolean = false;
  questions: Question[] = [];

  // приватное состояние
  toServer: AnswersQuiz = { questions: [] };
  form: FormGroup;
  private _incorrect: number;
  private _currentQuestionIdx: number = 0;

  get answersFormArray() {
    return this.form.controls.answers as FormArray;
  }

  get getCurrentQuestion() {
    return this.questions[this._currentQuestionIdx];
  }

  get getIncorrectAnswers() {
    return this.questions.length - this._incorrect
  }

  constructor(
    // код стайл либо с нижним подчеркиванием, либо без него, надо определиться и использовать
    // это решается через линтер
    private questionService: QuestionService,
    private _fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.form = this._fb.group({
      answers: new FormArray([], [
        MyValidators.minSelectedCheckboxes(1) // неверная валидация, правильных ответов вполне может и не быть на вопрос!
      ]),
    });
    this._getQuizAll();
  }

  // лишний параметр questionId, эта инфа уже есть внутри класса через this.getCurrentQuestion.id
  handleSubmitForm(questionId: number) {
    this.loading = true; // лоадинг надо держать ближе к месту его применения

    // лучше всего вынести подготовку toServer в отдельный метод
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
    this._nextCardQuiz();
    this._sendDataToServer();
  }

  private _nextCardQuiz() {
    this.form.reset();
    this._currentQuestionIdx++;
  }

  private _sendDataToServer() {
    // логика этого if должна быть уровнем выше, чтобы либо отправлять данные на сервер, либо переходить к след вопросу
    if (this._currentQuestionIdx === this.questions.length) {
      // здесь то место, где нужно было делать loading=true, а не во внешнем коде
      this.questionService.sendAnswers(this.toServer).subscribe((res) => {
        this._incorrect = res.length
        this.loading = false;
      });
    } else {
      this.loading = false; // без контекста сделано неверно (сказал на видео)
    }
  }

  private _addCheckboxes() {
    // так не пойдёт, проверь что будет если у тебя будет разное кол-во ответов на вопрос между вопросами
    this.questions[0].answers.forEach(() =>
      this.answersFormArray.push(new FormControl(false))
    );
  }

  // отлично что вынес в отдельный метод, кроме того до вызова getQuestions() стоит очищать стейт, в частности this.questions = []
  private _getQuizAll(): void {
    this.loading = true;
    this.questionService.getQuestions().subscribe((questions) => {

      this.questions = questions; // здесь жёсткая зависимость по порядку строк кода, старайся этого избегать
      this._addCheckboxes(); // опасно, если ты не делаешь перед этим сброс по кол-ву чекбоксов в FormArray
      this._currentQuestionIdx = 0;
      this.loading = false; // некорректно, если getQuestions() выдаст ошибку, loading будет бесконечный
    });
  }

  retry(): void {
    this._currentQuestionIdx = 0;
    this.toServer = { questions: [] };
  }
}

