class IDGenerator {

  secrete = 'haibaraaihuiyuanaiyyds'

  instance = null

  getInstance () {
    if (this.instance) return this.instance
    return new IDGenerator()
  }

  generateSocketID (userId: number): string {
    return (new Date().getTime() % 100000000) + '' + this.getRandom() + userId + ''
  }

  getRandom (range: number = 1000): string {
    const len = this.secrete.length
    return this.secrete.substring(Math.floor(Math.random() * len/2), Math.floor(Math.random() * len/2 + len/2)) + Math.ceil(Math.random() * range)
  }

}

export default new IDGenerator()