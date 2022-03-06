export interface Validator {
  checkParams: Function,
  params: any,
  [fn: string]: any,
}

export interface Exception {
  code: number,
  message: string,
  config: ExceptionConfig,
}

export interface Account {
  username: string,
  password: string
}
 
export interface ExceptionConfig {
  [errCode: number]: string
}

export interface Pager {
  page: number,
  size?: number,
}