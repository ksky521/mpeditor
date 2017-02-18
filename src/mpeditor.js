require('./css/common.scss')
require('./css/mpeditor.scss')
require('./css/theme-white.scss')

console.log('success!')
import $ from 'jQuery'

// ace
import * as ace from 'brace'
import 'brace/mode/markdown'
import 'brace/theme/dawn'

// showdown
import showdown from 'showdown'
import './js/showdown-plugins/showdown-prettify-for-wechat.js'
import './js/showdown-plugins/showdown-github-task-list.js'
import './js/showdown-plugins/showdown-footnote.js'
const converter = new showdown.Converter({
  extensions: ['prettify', 'tasklist', 'footnote'],
  tables: true
})

// 语法高亮
import './js/google-code-prettify/run_prettify.js'

$(() => {
  const editor = initEditor('js-mpe-textarea')
  const $textarea = $('#js-mpetextarea')
  const $win = $(window)
    // const $perview = $('#js-mpe-perview')
  const resizeHandler = () => {
    let height = $win.height()
    $textarea.height(height)
  }

  $win.resize(resizeHandler).resize()
})

// 初始化编辑器
function initEditor(id) {
  let editor = ace.edit(id)
  editor.setOption('spellcheck', true)
  editor.setOption('scrollPastEnd', true)
  editor.renderer.setShowGutter(false)
  editor.renderer.setPrintMarginColumn(false)
  editor.getSession().setUseWrapMode(true)
  editor.getSession().setNewLineMode('unix')
  editor.getSession().setMode('ace/mode/markdown')
  editor.setTheme('ace/theme/dawn')
  return editor
}
var PR = require('PR')
var md = 'I am using __markdown__.\n' +
  '```js\n' +
  'alert(1);\n' +
  'alert(3);\n' +
  '```'
console.log(converter.makeHtml(md), PR)
