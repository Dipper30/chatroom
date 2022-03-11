import { useEffect, useRef } from 'react'

/**
 * use previous state
 * @param value 
 * @returns 
 */
const usePrevious = (value: any): any => {
  const ref = useRef<any>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default usePrevious