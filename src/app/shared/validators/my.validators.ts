import { FormArray, FormControl, ValidatorFn } from '@angular/forms';

export class MyValidators {
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
