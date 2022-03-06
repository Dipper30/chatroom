const validator = require('validator')

import { Validator } from '../types/common'
import { queryIsNull } from '../utils/tools'
import { ParameterException } from '../exception'
import { errCode } from '../config'

class BaseValidator implements Validator {

  params: any
  stringIsDigit: RegExp = /^\d+$/ // check if the string consists of numbers

  constructor (params: any) {
    this.params = params
  }

  createError (msg: string = 'Parameter Error'): ParameterException {
    return new ParameterException(errCode.PARAMETER_ERROR, msg)
  }

  // 'continue' will not work in a for of loop
  // use 'for' here
  checkParams (params: any, rules: string[]): Boolean {
    // 遍历每一个属性名的规则
    for (let i = 0; i < rules.length; i++) {
      const single_rule = rules[i]
      // 将rule字符串转成数组
      let single_rule_arr: string[] = single_rule.split('|')
      const key = single_rule_arr[0]
      const type = single_rule_arr[1]
      // 当指定参数名不存在时，优先校验required属性
      if ( !params.hasOwnProperty(key) ) {
        if ( single_rule_arr.includes('required') ) return false
        else continue
      } else {
        // 此时请求参数中存在规则内的属性名
        // 判断是否可以为空值
        if ( single_rule_arr.includes('allowNull') && params[key] == null ) {
          continue
        }
        switch (type) {
          case 'number': 
            if ( typeof params[key] != 'number' ) return false
            break
          case 'string': 
            if ( typeof params[key] != 'string' ) return false
            break
          case 'boolean': 
            if ( params[key] != false && params[key] != true ) return false
            break
          case 'date':
            if ( !validator.isDate(params[key]) ) return false
            break
          case 'array':
            if (!Array.isArray(params[key])) return false
            break
          case 'timestamp':
            if ( !this.isTimeStamp(params[key]) ) return false
            break
          case 'unixTimestamp':
            if ( !this.isUnixTimeStamp(params[key]) ) return false
            break
          default:
            break
        }
      }
    }
    return true
  }

  /**
   * check for queries where all values are string
   * @param {any} params query, which is typeof string 
   * @param {string[]} rules
   * @returns A modified query, numerics converted into int, boolean values converted into Boolean
   */
  // 
  checkQuery (params: any, rules: string[]): any {
    if (!params) return {}
    // 遍历每一个属性名的规则
    for (let i = 0; i < rules.length; i++) {
      const single_rule = rules[i]
      // 将rule字符串转成数组
      let single_rule_arr: string[] = single_rule.split('|')
      const key = single_rule_arr[0]
      const type = single_rule_arr[1]
      // 当指定参数名不存在时，优先校验required属性
      if ( !params.hasOwnProperty(key) ) {
        if ( single_rule_arr.includes('required') ) return false
        else continue
      } else {
        // 此时请求参数中存在规则内的属性名
        // 判断是否可以为空值
        if ( single_rule_arr.includes('allowNull') && queryIsNull(params[key]) ) {
          continue
        }
        switch (type) {
          case 'number': 
            if ( typeof params[key] != 'number' && !this.stringIsNumeric(params[key]) ) return false
            params[key] = Number(params[key])
            break
          case 'string': 
            if ( typeof params[key] != 'string' ) return false
            break
          case 'boolean': 
            if ( !validator.isBoolean(params[key]) && this.stringIsBoolean(params[key]) ) return false
            params[key] = params[key] == 'false' ? false : true
            break
          case 'timestamp':
            if ( !this.stringIsNumeric(params[key]) ) return false
            params[key] = Number(params[key])
            if ( !this.isTimeStamp(params[key]) ) return false
            break
          case 'unixTimestamp':
            if ( !this.stringIsNumeric(params[key]) ) return false
            params[key] = Number(params[key])
            if ( !this.isUnixTimeStamp(params[key]) ) return false
            break
          default:
            break
        }
      }
    }
    return params
  }

  isPositiveInteger (n: any): Boolean {
    return Boolean(n) && typeof n == 'number' && n > 0
  }

  /**
   * check if all the attributes in the object are IDs, which are positive integers
   * @param {object} o 
   * @param {string[]} attrs 
   * @returns boolean
   */
  attrsAreIDs (o: any, attrs: string[]): Boolean {
    if (typeof o != 'object') return false
    for (let a of attrs) {
      if (o.hasOwnProperty(a) && !this.isPositiveInteger(o[a])) return false
    }
    return true
  }

  // unix timestamp must be 13 digits
  isTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
  }

  // unix timestamp must be 10 digits
  isUnixTimeStamp (ts: number): Boolean {
    return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
  }

  // check zip code, 5-digit long
  isZipCode (code: any): Boolean {
    return Boolean(code) && typeof code == 'number' && code.toString().length == 5
  }

  // check if the number is between min and max
  // or check if the length of string is between min and max
  isBetween (p: any, min: number, max: number): Boolean {
    return Boolean(p) 
    && (typeof p == 'number' && p >= min && p <= max)
    || (typeof p == 'string' && p.length >= min && p.length <=max)
  }

  // check if the length of name is between [3, 15]
  // you can use function isBetween of course, but this is more convenient in particular cases
  isShortName (p: any): Boolean {
    return this.isBetween(p, 3, 15)
  }

  isLongName (p: any): Boolean {
    return this.isBetween(p, 5, 30)
  }

  stringIsNumeric (s: string): Boolean {
    return this.stringIsDigit.test(s)
  }

  stringIsBoolean (s: string): Boolean {
    return s == 'false' || s == 'true'
  }

  // if the param does not include page, return true
  // else if the param 
  checkPager (p: any): Boolean {
    if (!p.hasOwnProperty('pager')) return true
    const { pager } = p
    if (pager.hasOwnProperty('page')) {
      if (!this.isPositiveInteger(pager.page)) return false
    } else if (!pager.hasOwnProperty('size')) {
      return false // no page and no size
    } else {
      return this.isPositiveInteger(pager.size)
    }
    return true
  }

  isPhone (phone: number): Boolean {
    const phoneExp = /^[0-9]{10}/
    return phoneExp.test(phone.toString())
  }

  isEmail (email: string): Boolean {
    const emailExp = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
    return emailExp.test(email)

  }

}

module.exports = BaseValidator