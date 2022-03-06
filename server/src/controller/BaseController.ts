export default class BaseController {

  attrsToOmit = ['createdAt', 'updatedAt']
  
  catchException (fn: Function) {
    return async (req: any, res: any, next: any): Promise<any> => Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }

}
