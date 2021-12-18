import { FormArray, FormControl, ValidatorFn } from '@angular/forms';

export class MyValidators {
  // идея хорошая, можно лучше, отдельный файл + тесты на каждую валидацию в отдельности
  static minSelectedCheckboxes(min: number = 1): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }
}
