export enum ResponseStatus {
  Success = 'success',
  Error = 'error'
}

export interface IResponse {
  data: any;
  message: string;
  status: ResponseStatus;
}
