import { Component } from '@angular/core';

// этот компонент лишний, не делает ничего полезного, лучше использовать lazy модуль для Quiz
// https://angular.io/guide/lazy-loading-ngmodules
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor(
  ) {}
}

