import showdown from 'showdown'
import $ from 'jQuery'
// const converter = new showdown.Converter()

let reg = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'

reg = '^```.*\\n[\\s\\S]*?\\n```|' + reg
reg = '^[ \\t]*\\n\\$\\$[\\s\\S]*?\\$\\$|' + reg
reg = '^[ \\t]*\\n\\\\\\\\[[\\s\\S]*?\\\\\\\\]|' + reg
reg = '^[ \\t]*\\n\\\\?\\\\begin\\{[a-z]*\\*?\\}[\\s\\S]*?\\\\end\\{[a-z]*\\*?\\}|' + reg
reg = new RegExp(reg, 'gm')

const $win = $(window)
showdown.extension('section-divider', () => {
  return [{
    type: 'lang',
    filter: (text) => {
      text = text.replace(/(^|\n)```([^\n]*?)```([ \t]*(?=\n))/g, function (a, b, c, d) {
        return b + '```\n' + c + '\n```' + d
      })
      text = text + '\n\n'

      let mdSectionList = []
      let startIndex = 0
      function buildSections (startIndex, endIndex) {
        let subStr = text.substring(startIndex, endIndex)
        let newText = '\n<div class="mpe-section-divider"></div>\n\n' + subStr + '\n'
        mdSectionList.push({
          text: subStr,
          textWithDelimiter: newText
        })
        return newText
      }

      text.replace(reg, (match, index) => {
        buildSections(startIndex, index)
        startIndex = index
        return match
      })
      buildSections(startIndex, text.length)
      $win.trigger('createMdSection', mdSectionList)
      return mdSectionList.reduce(function (a, b) {
        return a + b.textWithDelimiter
      }, '')
    }
  }]
})
