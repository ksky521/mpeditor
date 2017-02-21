import showdown from 'showdown'

const colors = {
  green: '#00cf02',
  blue: '#00bdff',
  red: '#ff656a',
  yellow: '#ffca00',
  success: '#00cf02',
  danger: '#ff656a',
  info: '#00bdff',
  warning: '#ffca00',
  gray: '#999999'
}
showdown.extension('colorful', () => {
  return [{
    type: 'lang',
    filter (text) {
      text = text.replace(/\[\^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})\^([\d.]+)(px|em|%)\s*([^\]]+)]/mg, (match, color, fontSize, unit, txt) => {
        // 自定义颜色+字号
        if (colors[color]) {
          color = colors[color]
        }
        if (color && fontSize && unit) {
          return '<span style="color:' + color + ';font-size:' + fontSize + unit + '">' + txt + '</span>'
        }
        return match
      }).replace(/\[\^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})\s*([^\]]+)]/mg, (match, color, txt) => {
        // 单独自定义颜色
        if (colors[color]) {
          color = colors[color]
        }
        if (color) {
          return '<span style="color:' + color + '">' + txt + '</span>'
        }
        return match
      }).replace(/\[\^([\d.]+)(px|em|%)\s*([^\]]+)]/mg, (match, fontSize, unit, txt) => {
        // 单独自定义字号
        if (fontSize && unit) {
          return '<span style="font-size:' + fontSize + unit + '">' + txt + '</span>'
        }
        return match
      })
      text = text.replace(/[\n]+[-]{2,}eof[-]{2,}[\n\s]+/ig, (m, footer) => {
        return '<section><section style="margin:5px auto;padding-top:1.2em;padding-bottom:0.6em;"><section style="font-size:1em; border-style: solid none none; border-top-width: 1px; border-color: rgb(17, 17, 17); color: rgb(204, 204, 204);" class="96wx-bdc"></section><section style="margin-top: -0.7em;text-align:center;line-height:1.4;"><span style="padding:8px 23px;background-color:#fff;color:#000;margin-top:-1em;">EOF</span></section></section></section><!--FT-PLACEHOLDER-->'
      })
      return text
    }
  }, {
    type: 'output',
    filter (text) {
      text = text.split('<!--FT-PLACEHOLDER-->')
      if (text.length === 2) {
        text[1] = `<section>
                <section style="font-size:12px;color:#8e8e8e">
                ${text[1]}
                </section>
              </section>`
      }
      return text.join('\n')
    }
  }]
})
