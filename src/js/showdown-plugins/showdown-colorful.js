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
    filter: (text) => {
      text = text.replace(/\[\^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})\s*([^\]]+)]/mg, (match, color, txt) => {
        if (colors[color]) {
          color = colors[color]
        }
        if (color) {
          return '<span style="color:' + color + '">' + txt + '</span>'
        }
        return match
      })
      text = text.replace(/[\n]+[-]{2,}eof[-]{2,}[\n\s]+/ig, () => {
        return '<section style="border-top:1px solid #666;line-height:1.5em;text-align:center;width:80%;margin:2.4em auto 1.5em;"><span style="position:relative;top:-0.9em;padding:0 .55em;background-color:#fff">EOF</span></section>'
      })
      return text
    }
  }]
})
