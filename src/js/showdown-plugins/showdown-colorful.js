import showdown from 'showdown'

const colors = [0, 0, '#00cf02', '#ff656a', '#00bdff', '#ffca00']
showdown.extension('colorful', () => {
  return [{
    type: 'lang',
    filter: (text) => {
      text = text.replace(/(@{2,5})(.+?)\1/g, (match, color, txt) => {
        color = colors[color.length]
        if (color) {
          return '<span style="color:' + color + '">' + txt + '</span>'
        }
        return match
      })
      return text
    }
  }]
})
