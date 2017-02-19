require('./css/common.scss')
require('./css/mpeditor.scss')
require('./css/theme-white.scss')

import $ from 'jQuery'

// ace
import * as ace from 'brace'
import 'brace/mode/markdown'
import 'brace/theme/github'

// showdown
import showdown from 'showdown'
import './js/showdown-plugins/showdown-prettify-for-wechat.js'
import './js/showdown-plugins/showdown-github-task-list.js'
import './js/showdown-plugins/showdown-footnote.js'

// 语法高亮
import './js/google-code-prettify/run_prettify.js'

const PR = require('PR')

const tmpl = `
<div eclass="mpe-col" class="mpe-editor-col mpe-col mpe_fl">
  <div class="mpe-editor-tools"></div>
  <div class="mpe-editor-wrap">
    <div eid="editor" class="mpe-editor"></div>
  </div>
</div>
<div eclass="mpe-col" class="mpe-preview-col mpe-col mpe_fr">
  <div class="mpe-preview-tools"></div>
  <div class="mpe-preview-wrap">
    <div class="mpe-preview" eid="preview"></div>
  </div>
</div>
`
  // const $win = $(window)

export default class Editor {
  constructor (node, { text, updateDelayTime = 300 } = {}) {
    let $container = $(node).html(tmpl)
    this.$container = $container
    let that = this
    $container.find('[eid]').each((i, dom) => {
      dom = $(dom)
      let id = dom.attr('eid')
      that['$' + id] = dom
    })

    this.resize()
    let editor = this.editor = this._initEditor(this.$editor[0], text)
    this.converter = this._initShowdown()
    if (text) {
      this.updatePreview(text)
    }

    let timer
    editor.on('change', () => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => that.updatePreview(), updateDelayTime)
    })
    this._bindEvent()
  }
  setValue (content) {
    this.editor.setValue(content)
    this.updatePreview()
    return this
  }
  updatePreview (content) {
    // console.log(this.editor.getValue())
    let val = this.converter.makeHtml(content || this.editor.getValue())
    this.$preview.html(val).find('li').each(function () {
      $(this).html('<span>' + $(this).html() + '</span>')
    })
    PR.prettyPrint()
    return this
  }

  // 改变大小
  resize (height) {
    height = height || this.$container.height()
    this.$editor.height(height)
    this.$preview.height(height)
    this.$container.find('[eclass=mpe-col]').height(height)
    this.editor && this.editor.resize()
  }
    // 私有方法
  _initShowdown () {
    let converter = new showdown.Converter({
      extensions: ['prettify', 'tasklist', 'footnote'],
      tables: true
    })
    return converter
  }

  _bindEvent () {
    let sessionEditor = this.editor.getSession()
    let $preview = this.$preview
    sessionEditor.on('changeScrollTop', (scrollTop) => $preview.scrollTop(scrollTop))

    $preview.on('scroll', function () {
      sessionEditor.setScrollTop($(this).scrollTop())
    })
  }
    // 初始化编辑器
  _initEditor (id, val) {
    let editor = ace.edit(id)
    editor.setOption('spellcheck', true)
    editor.setOption('scrollPastEnd', true)
    editor.renderer.setShowGutter(false)
    editor.renderer.setPrintMarginColumn(false)
    editor.getSession().setUseWrapMode(true)
    editor.getSession().setNewLineMode('unix')
    editor.getSession().setMode('ace/mode/markdown')
    editor.setTheme('ace/theme/github')
    if (val) {
      editor.setValue(val)
    }
    return editor
  }
}
