import {Answer} from "@app/_models/answer";

export class Question {
  id: number;
  question: string;
  answers: Answer [];
}
