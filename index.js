class Print {
  constructor(
    dom,
    { title = document.title, mode = 'portrait', margin = '10mm' } = {}
  ) {
    this.dom = dom;
    this.title = title;
    this.mode = mode;
    this.margin = '10mm';
  }

  /** @description 特定的打印样式 */
  printStyle() {
    let mode = this.mode.toLowerCase()
    mode = mode === 'landscape' ? mode : 'portrait'
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `@page { size: ${mode}; margin: 10mm;}`
    return style
  }

  /**
   * @description 获取当前页面所有的style、link、meta及传入的dom对象
   * */
  printAllDom() {
    let copyDom = document.createElement('span')
    const styleDom = document.querySelectorAll('style, link, meta')
    const titleDom = document.createElement('title')
    titleDom.innerText = this.title
    copyDom.appendChild(titleDom)
    Array.from(styleDom).forEach(item => {
        copyDom.appendChild(item.cloneNode(true))
    })
    copyDom.appendChild(this.printStyle())
    copyDom.appendChild(this.dom.cloneNode(true))
    this.htmlTemp = copyDom.innerHTML
    copyDom = null
  }

  /**
   * @description 生成iframe
   */
  printIframeDom() {
    const iframeDom = document.createElement('iframe')
    const attrObj = {
        height: 0,
        width: 0,
        border: 0,
        wmode: 'Opaque'
    }
    const styleObj = {
        position: 'absolute',
        top: '-999px',
        left: '-999px'
    }
    Object.entries(attrObj).forEach(([key, value]) => { iframeDom.setAttribute(key, value) })
    Object.entries(styleObj).forEach(([key, value]) => { iframeDom.style[key] = value })
    document.body.insertBefore(iframeDom, document.body.children[0])
    const iframeWin = iframeDom.contentWindow
    const iframeDocs = iframeWin.document
    iframeDocs.write(`<!doctype html>`)
    iframeDocs.write(this.htmlTemp)
    iframeDocs.body.setAttribute('style', '-webkit-print-color-adjust: exact;')
    iframeWin.focus()
    iframeWin.print()
    document.body.removeChild(iframeDom)
  }

  /** @description 开始打印*/
  start() {
    this.printAllDom()
    this.printIframeDom()
  }
}

export default Print
