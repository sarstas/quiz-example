import {Component, OnInit} from '@angular/core';
import {QuestionService} from '@app/_services/question.service';
import {Question} from '@app/_models';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  questions: Question[];
  answerForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  submitted: boolean = false;

  constructor(private userService: QuestionService, private _fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getQuizAll();
    this.answerFormGroup();
  }

  answerFormGroup() {
    this.answerForm = this._fb.group({
      question: ['Name question'],
      answers: this._fb.array([])
    });
  }

  getQuizAll() {
    this.loading = true;

    this.userService.getQuestions().subscribe((questions) => {
      this.questions = questions.data.data;
      debugger
      this.questions.forEach((question) => {
        question.answers.forEach((answer) => {
          (this.answerForm.get('answers') as FormArray).push(new FormControl([answer.value]))
        })
      })
      this.loading = false;
    });
  }

 /* fu answers(): FormArray {
    return this.answerForm.get('answers') as FormArray ;
  };*/

  submit() {
    console.log(this.answerForm.value);
  }
}
