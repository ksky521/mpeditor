require('./css/common.scss')
require('./css/mpeditor.scss')

console.log('success!')
import $ from 'jQuery'

var ace = require('brace')
require('brace/mode/markdown')
require('brace/theme/dawn')
console.log(ace.edit)
console.log($('body').css('background-color'))

var showdown = require('showdown')
require('./js/showdown-plugins/showdown-prettify-for-wechat.js')
require('./js/showdown-plugins/showdown-github-task-list.js')
require('./js/showdown-plugins/showdown-footnote.js')

require('./js/google-code-prettify/run_prettify.js')

var converter = new showdown.Converter({
  extensions: ['prettify', 'tasklist', 'footnote'],
  tables: true
})

var PR = require('PR')
var md = 'I am using __markdown__.\n' +
  '```js\n' +
  'alert(1);\n' +
  'alert(3);\n' +
  '```'
console.log(converter.makeHtml(md), PR)
