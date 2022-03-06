import NotifyFC from '../components/common/Notify'
import ReactDOM from 'react-dom'

class NotifyGenerator {
  static message = []
  static instance = null

  constructor () {
    this.message = new Array(100).fill(null)
  }

  static _getInstance () {
    return this.instance ? this.instance : new NotifyGenerator()
  }

  size () {
    return this.message.length
  }

  generateNotify (msg = '', delay = 3400, type = 'success') {
    this.addMessage({ msg, delay, type })
  }

  /**
   * add msg to message list and return its index
   * @param {*} msg 
   * @returns {number} index
   */
  addToArray (msg) {
    for (let i = 0; i < this.message.length; i++) {
      if (this.message[i] == null) {
        this.message[i] = msg
        return i
      }
    }
  }

  popArray (msg) {
    for (let i = 0; i < this.message.length; i++) {
      if (this.message[i] == msg) {
        this.message[i] = null
      }
    }
  }

  addMessage (msg) {
    const index = this.addToArray(msg)
    console.log('@@@@ ', index)
    const div = document.createElement('div')
    div.className = 'notify'
    div.style = `top: ${30 + index * 50}px;`
    setTimeout(() => {
      div.className = 'notify enter'
    }, 50)
    document.body.appendChild(div)
    console.log(this.message, this.message.length)
    ReactDOM.render(
      <NotifyFC message={msg.msg} delay={msg.delay} type={msg.type} height={this.message.length} />,
      div)

    setTimeout(() => {
      div.className = 'notify quit'
    }, msg.delay - 700)
    let timer = setTimeout(() => {
      this.destroy(div)
      clearTimeout(timer)
      this.popArray(msg)
    }, msg.delay)
  }

  destroy (node) {
    ReactDOM.unmountComponentAtNode(node)
    document.body.removeChild(node)
  }
}

const g = NotifyGenerator._getInstance()

export default g