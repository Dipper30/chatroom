import { getTS } from '../service/utils'

export const getRandomId = (): number => {
  return getTS()
}

export const createImage = (imgSrc: string): HTMLImageElement => {
  const image = new Image()
  image.src = imgSrc
  return image
}
