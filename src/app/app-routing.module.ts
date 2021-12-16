import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "@app/home/home.component";
import {AuthGuard} from "@app/auth/auth.guard";
import {LoginComponent} from "@app/auth/components/login/login.component";
import {NonAuthGuard} from "@app/auth/non-auth.guard";
import { QuizComponent } from '@app/home/components/quiz/quiz.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: '/quiz', pathMatch: 'full'},
      {path: 'quiz', component: QuizComponent}
    ] },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
