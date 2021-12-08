import {Answer} from "@app/_models/answer";

export interface Question {
  id: number;
  question: string;
  answers: Answer [];
}
