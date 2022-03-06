import { errCode } from '../config'
import { ParameterException } from '../exception'

export const isPositiveInteger = (n: any): Boolean => {
  return Boolean(n) && typeof n == 'number' && n > 0
}

/**
 * check if all the attributes in the object are IDs, which are positive integers
 * @param {object} o 
 * @param {string[]} attrs 
 * @returns boolean
 */
export const attrsAreIDs = (o: any, attrs: string[]): Boolean => {
  if (typeof o != 'object') return false
  for (let a of attrs) {
    if (o.hasOwnProperty(a) && !isPositiveInteger(o[a])) return false
  }
  return true
}

// unix timestamp must be 13 digits
export const isTimeStamp = (ts: number): Boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
}

// unix timestamp must be 10 digits
export const isUnixTimeStamp = (ts: number): Boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
}

// check zip code, 5-digit long
export const isZipCode = (code: any): Boolean => {
  return Boolean(code) && typeof code == 'number' && code.toString().length == 5
}

// check if the number is between min and max
// or check if the length of string is between min and max
export const isBetween = (p: any, min: number, max: number): Boolean => {
  return Boolean(p) 
  && (typeof p == 'number' && p >= min && p <= max)
  || (typeof p == 'string' && p.length >= min && p.length <=max)
}

// check if the length of name is between [3, 15]
// you can use function isBetween of course, but this is more convenient in particular cases
export const isShortName = (p: any): Boolean => {
  return isBetween(p, 3, 15)
}

// export const stringIsNumeric = (s: string): Boolean => {
//   return stringIsDigit.test(s)
// }

export const stringIsBoolean = (s: string): Boolean => {
  return s == 'false' || s == 'true'
}

export const createError = (msg: string = 'Parameter Error'): ParameterException => {
  return new ParameterException(errCode.PARAMETER_ERROR, msg)
}