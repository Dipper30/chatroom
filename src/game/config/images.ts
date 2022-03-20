const map1Src = require('../assets/GameMap_map1.jpeg')

export const maps: any = {
  map1: {
    name: 'map1',
    imgSrc: map1Src,
    width: 750,
    height: 600,
  },
  map2: {
    name: 'map2',
    imgSrc: map1Src,
    width: 750,
    height: 600,
  },
}

export const roleSprites: any = {
  default: {
    imgSrc: require('../assets/GamePlayer_default.png'),
    standDown: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 0,
      },
    },
    standUp: {
      cropWidth: 120,
      width: 120,
      height: 150,
      startPosition: {
        x: 0,
        y: 2 * 130,
      },
    },
    standLeft: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 1 * 130,
      },
    },
    standRight: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 3 * 130,
      },
    },
    right: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 7 * 130,
      },
    },
    left: {
      cropWidth: 120,
      width: 120,
      height: 130,
      startPosition: {
        x: 0,
        y: 5 * 130,
      },
    },
    down: {
      cropWidth: 120,
      width: 120,
      height: 140,
      startPosition: {
        x: 0,
        y: 4 * 130,
      },
    },
    up: {
      cropWidth: 120,
      width: 120,
      height: 130,
      startPosition: {
        x: 0,
        y: 6 * 130,
      },
    },
  },
}

export const Map2: any = {
  namespace: 'map1',
  imgSrc: './assets/GameMap_map1.jpeg',
  width: 750,
  height: 600,
}