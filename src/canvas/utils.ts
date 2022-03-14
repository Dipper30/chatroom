/**
* get frame of blink animation
* @returns {number} frame for hault
*/
// export const getBlinkFrame = (): number => {
//  let frame = 0
//  if (role.frame > role.blinkDelay + haultRandom && role.frame < role.blinkDelay + 10 + haultRandom) frame = 1
//  if (role.frame >= role.blinkDelay + 10 + haultRandom && role.frame < role.blinkDelay + 22 + haultRandom) frame = 2
//  if (role.frame >= role.blinkDelay + 22 + haultRandom) {
//    role.frame = 0
//    haultRandom = Math.random() * 160
//  }
//  return frame
// }
import { getTS } from '../service/utils'

export const getRandomId = () => {
  return getTS()
}