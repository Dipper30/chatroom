import NotifyFC from '../components/common/Notify'
import ReactDOM from 'react-dom'

class NotifyGenerator {
  message = []
  static instance = null

  static _getInstance () {
    return this.instance ? this.instance : new NotifyGenerator()
  }

  size () {
    return this.message.length
  }

  generateNotify (msg = '', delay = 3400, type = 'success') {
    this.addMessage({ msg, delay, type })
  }

  addMessage (msg) {
    this.message.push(msg)
    const div = document.createElement('div')
    div.className = 'notify'
    div.style = `top: ${30 + this.size() * 50}px;`
    setTimeout(() => {
      div.className = 'notify enter'
    }, 100)
    document.body.appendChild(div)
    ReactDOM.render(
      <NotifyFC message={msg.msg} delay={msg.delay} type={msg.type} height={this.message.length} />,
      div)

    setTimeout(() => {
      div.className = 'notify quit'
    }, msg.delay - 700)
    let timer = setTimeout(() => {
      this.destroy(div)
      clearTimeout(timer)
      this.message.shift()
    }, msg.delay)
  }

  destroy (node) {
    ReactDOM.unmountComponentAtNode(node)
    document.body.removeChild(node)
  }
}

const g = NotifyGenerator._getInstance()

export default g