import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/_services/user.service";
import {Qustion} from "@app/_models";
import {first} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  questions: Qustion[];

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.getQuizList();
  }

  getQuizList() {
    this.userService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

}
