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
    let mode = this.mode.toLowerCase();
    mode = mode === 'landscape' ? mode : 'portrait';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `@page { size: ${mode}; margin: 10mm;}`;
    return style;
  }

  /**
   * @description 获取当前页面所有的style、link、meta及传入的dom对象
   * */
  printAllDom() {
    let copyDom = document.createElement('span');
    const styleDom = document.querySelectorAll('style, link, meta');
    const titleDom = document.createElement('title');
    titleDom.innerText = this.title;
    copyDom.appendChild(titleDom);
    Array.from(styleDom).forEach(item => {
      copyDom.appendChild(item.cloneNode(true));
    });
    copyDom.appendChild(this.printStyle());
    this.headTemp = copyDom.innerHTML;
    copyDom = null;
  }

  /**
   * @description 生成iframe
   */
  printIframeDom() {
    const iframeDom = document.createElement('iframe');
    const attrObj = {
      height: 0,
      width: 0,
      border: 0,
      wmode: 'Opaque'
    };
    const styleObj = {
      position: 'absolute',
      top: '-999px',
      left: '-999px'
    };
    Object.entries(attrObj).forEach(([key, value]) => {
      iframeDom.setAttribute(key, value);
    });
    Object.entries(styleObj).forEach(([key, value]) => {
      iframeDom.style[key] = value;
    });
    iframeDom.srcdoc = `<html><head>${
      this.headTemp
    }</head></head><body style="-webkit-print-color-adjust: exact;">${
      this.dom.outerHTML
    }</body></html>`;
    this.iframeDom = iframeDom;
  }

  /** @description 开始打印*/
  start() {
    this.printAllDom();
    this.printIframeDom();
    document.body.insertBefore(this.iframeDom, document.body.children[0]);
    const iframeWin = this.iframeDom.contentWindow;
    this.iframeDom.onload = () => {
      iframeWin.focus();
      iframeWin.print();
      document.body.removeChild(this.iframeDom);
      this.iframeDom = null;
    };
  }
}

if (typeof window !== 'undefined') {
  window.printjs = Print;
}

export default Print;
