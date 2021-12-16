import { ErrorType } from '@app/shared/rest/errors/error-type';

export class RestFatalError extends Error {
  public override name = ErrorType.RestFatalError;

  constructor(public override message: string) {
    super(message);
  }
}
