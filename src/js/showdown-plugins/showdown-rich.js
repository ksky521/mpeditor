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
function styleParser (css) {
  css = css.split(';')
  css = css.map((style) => {
    if (/^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})$/.test(style)) {
      // 颜色
      let color = style
      // 自定义颜色
      if (colors[style]) {
        color = colors[style]
      }
      return `color:${color}`
    } else if (/^[\d.]+(px|em|%)$/.test(style)) {
      return `font-size:${style}`
    } else if (style === 'strong') {
      return `font-weight:bold`
    } else if (style === 'center') {
      return 'text-align:center'
    } else {
      return style
    }
  }).filter((v) => {
    return v !== ''
  })
  return css.join(';')
}

showdown.extension('rich', () => {
  return [{
    type: 'lang',
    filter (text) {
      text = text.replace(/\[("|')(.+?)\1\s*(.+?)]/g, (m, quote, css, text) => {
        css = styleParser(css)
        if (css) {
          return `<span style="${css}">${text}</span>`
        }
        return text
      })

      text = text.replace(/[\n]+[-]{2,}eof[-]{2,}[\n\s]+/ig, (m, footer) => {
        return '<section><section style="margin:5px auto;padding-top:1.2em;padding-bottom:0.6em;"><section style="font-size:1em; border-style: solid none none; border-top-width: 1px; border-color: rgb(17, 17, 17); color: rgb(204, 204, 204);"></section><section style="margin-top: -0.7em;text-align:center;line-height:1.4;"><span style="padding:8px 23px;background-color:#fff;color:#000;margin-top:-1em;">EOF</span></section></section></section><!--FT-PLACEHOLDER-->'
      })
      return text
    }
  },
  // {
  //   type: 'output',
  //   filter (text) {
  //     return text.replace(/<li>(.+?)<\/li>/ig, (m, txt) => {
  //       return `<li><section><section class="mpe-wechat-li" style="font-size:16px;"><span>${txt}</span></section></section></li>`
  //     })
  //   }
  // },
  {
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
      text = text.join('\n')
      text = text.replace(/<p>\s*\[center]((.+\n)+.*?)\[\/center]\s*<\/p>/gi, function (m, txt) {
        return `<section style="text-align:center;">${txt}</section>`
      })
      return text
    }
  }]
})
