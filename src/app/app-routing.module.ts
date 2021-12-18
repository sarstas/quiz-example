import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "@app/home/home.component";
import {LoginComponent} from "@app/auth/components/login/login.component";
import {NonAuthGuard} from "@app/auth/non-auth.guard";
import { QuizComponent } from '@app/home/components/quiz/quiz.component';

/**
 * Неудобно скользить взглядом слева направо по объекту, лучше делать новое свойство на новой строке
 */
const routes: Routes = [
  // я убрал AuthGuard потому что он не нужен для публичной части системы, нужен логин только для CRUD по вопросам из квиза (в админке)
  { path: '', component: HomeComponent, children: [
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
