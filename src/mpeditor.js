import './css/common.scss'
import './css/mpeditor.scss'
import './css/theme-white.scss'

import _ from 'underscore'
import $ from 'jQuery'
// import './js/jquery.easing.js'
// ace
import * as ace from 'brace'
import 'brace/mode/markdown'
import 'brace/theme/solarized_dark'

// showdown
import showdown from 'showdown'
import './js/showdown-plugins/showdown-prettify-for-wechat.js'
import './js/showdown-plugins/showdown-github-task-list.js'
import './js/showdown-plugins/showdown-footnote.js'
import './js/showdown-plugins/showdown-section-divider.js'

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
const $win = $(window)
let mdSections = []
let offsetBegin = 0
$win.on('createMdSection', (evt, data) => {
  mdSections = data.data
}).on('markdownTrim', (e, offset) => {
  offsetBegin = offset
})

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

    // 跟滚动相关
    this._scrollingHelper = $('<div>')
    this._isPreviewMoving = false
    this._isEditorMoving = false
    this._bindEvent()
  }
  setValue (content) {
    this.editor.getSession().setValue(content)
    this.updatePreview()
    return this
  }
  updatePreview (content) {
    // console.log(this.editor.getValue())
    let val = this.converter.makeHtml(content || this.editor.getValue())
    this.$preview.html(val)
    PR.prettyPrint()
    this._buildSection()

    return this
  }

  // 改变大小
  resize (height) {
    height = height || this.$container.height()
    this.$editor.height(height)
    this.$preview.height(height)
    this.$container.find('[eclass=mpe-col]').height(height)
    this.editor && this.editor.resize()
    this._buildSection()
  }
    // 私有方法
  _initShowdown () {
    let converter = new showdown.Converter({
      extensions: ['prettify', 'tasklist', 'footnote', 'section-divider'],
      tables: true
    })
    return converter
  }
  _buildScrollLink () {
    return _.throttle(() => {
      let that = this
      let mdSectionList = this._mdSectionList
      let htmlSectionList = this._htmlSectionList
      let aceEditor = this.editor
      if (mdSectionList.length === 0 || mdSectionList.length !== htmlSectionList.length) {
        this._doScrollLink()
        return
      }

      let editorScrollTop = aceEditor.renderer.getScrollTop()
      if (editorScrollTop < 0) {
        editorScrollTop = 0
      }

      let $previewElt = this.$preview
      let previewScrollTop = $previewElt.scrollTop()
      function getDestScrollTop (srcScrollTop, srcSectionList, destSectionList) {
        let sectionIndex
        let srcSection = _.find(srcSectionList, (section, index) => {
          sectionIndex = index
          return srcScrollTop < section.endOffset
        })
        if (srcSection === undefined) {
          return
        }
        let posInSection = (srcScrollTop - srcSection.startOffset) / (srcSection.height || 1)
        let destSection = destSectionList[sectionIndex]
        return destSection.startOffset + destSection.height * posInSection
      }

      let lastEditorScrollTop = this.lastEditorScrollTop
      let lastPreviewScrollTop = this.lastPreviewScrollTop
      let destScrollTop
      let isScrollEditor = this._scrollSyncLeader === 'editor'
      let isScrollPreview = this._scrollSyncLeader === 'preview'
      let scrollingHelper = this._scrollingHelper
      if (isScrollEditor === true) {
        if (Math.abs(editorScrollTop - lastEditorScrollTop) <= 9) {
          return
        }
        isScrollEditor = false
        lastEditorScrollTop = editorScrollTop
        destScrollTop = getDestScrollTop(editorScrollTop, mdSectionList, htmlSectionList)
        destScrollTop = _.min([
          destScrollTop,
          $previewElt.prop('scrollHeight') - $previewElt.outerHeight()
        ])
        if (Math.abs(destScrollTop - previewScrollTop) <= 9) {
          lastPreviewScrollTop = previewScrollTop
          return
        }
        scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
          value: destScrollTop - previewScrollTop
        }, {
          // easing: 'easeOutSine',
          duration: 200,
          queue: 'scrollLinkFx',
          step: function (now) {
            that._isPreviewMoving = true
            lastPreviewScrollTop = previewScrollTop + now
            $previewElt.scrollTop(lastPreviewScrollTop)
          },
          done: function () {
            _.defer(function () {
              that._isPreviewMoving = false
            })
          }
        }).dequeue('scrollLinkFx')
      } else if (isScrollPreview === true) {
        if (Math.abs(previewScrollTop - lastPreviewScrollTop) <= 9) {
          return
        }
        isScrollPreview = false
        lastPreviewScrollTop = previewScrollTop
        destScrollTop = getDestScrollTop(previewScrollTop, htmlSectionList, mdSectionList)

        destScrollTop = _.min([
          destScrollTop,
          aceEditor.session.getScreenLength() * aceEditor.renderer.lineHeight + aceEditor.renderer.scrollMargin.bottom - aceEditor.renderer.$size.scrollerHeight
        ])
        destScrollTop < 0 && (destScrollTop = 0)

        if (Math.abs(destScrollTop - editorScrollTop) <= 9) {
          lastEditorScrollTop = editorScrollTop
          return
        }
        scrollingHelper.stop('scrollLinkFx', true).css('value', 0).animate({
          value: destScrollTop - editorScrollTop
        }, {
          // easing: 'easeOutSine',
          duration: 200,
          queue: 'scrollLinkFx',
          step: function (now) {
            that._isEditorMoving = true
            lastEditorScrollTop = editorScrollTop + now
            aceEditor.session.setScrollTop(lastEditorScrollTop)
          },
          done: function () {
            _.defer(function () {
              that._isEditorMoving = false
            })
          }
        }).dequeue('scrollLinkFx')
      }
    }, 100)
  }

  _bindEvent () {
    let sessionEditor = this.editor.getSession()
    let $preview = this.$preview
    let that = this

    let buildSection = this._buildSection()
    this._doScrollLink = this._buildScrollLink()
    sessionEditor.on('changeScrollTop', () => {
      if (that._isEditorMoving === false) {
        that._scrollSyncLeader = 'editor'
        buildSection()
      }
    })

    $preview.on('scroll', () => {
      if (that._isPreviewMoving === false) {
        that._scrollSyncLeader = 'preview'
        buildSection()
      }
    })
  }
  _buildSection () {
    return _.throttle(() => {
      // console.log('buildSection')
      let $preview = this.$preview
      let preScrollTop = $preview.scrollTop()
      // 处理预览html
      let startOffset
      let htmlSectionList = []
      $preview.find('.mpe-section-divider').each((i, dom) => {
        if (startOffset === undefined) {
          startOffset = 0
          return
        }
        let $node = $(dom)
        let top = $node.position().top + preScrollTop
        htmlSectionList.push({
          startOffset: startOffset,
          endOffset: top,
          height: top - startOffset
        })
        startOffset = top
      })
      let scrollHeight = $preview.prop('scrollHeight')
      htmlSectionList.push({
        startOffset: startOffset,
        endOffset: scrollHeight,
        height: scrollHeight - startOffset
      })

      // 处理编辑器
      let mdSectionList = []
      let mdSectionOffset = 0
      let mdTextOffset = 0
      let editorSession = this.editor.session
      let editorLineHeight = this.editor.renderer.lineHeight

      let firstSectionOffset = offsetBegin

      mdSections.forEach((section) => {
        mdTextOffset += section.text.length + firstSectionOffset
        firstSectionOffset = 0
        let documentPosition = editorSession.doc.indexToPosition(mdTextOffset)
        let screenPosition = editorSession.documentToScreenPosition(documentPosition.row, documentPosition.column)
        let newSectionOffset = screenPosition.row * editorLineHeight
        var sectionHeight = newSectionOffset - mdSectionOffset
        mdSectionList.push({
          startOffset: mdSectionOffset,
          endOffset: newSectionOffset,
          height: sectionHeight
        })
        mdSectionOffset = newSectionOffset
      })
      this._mdSectionList = mdSectionList
      this._htmlSectionList = htmlSectionList
      // apply Scroll Link (-10 to have a gap > 9px)
      this.lastEditorScrollTop = -10
      this.lastPreviewScrollTop = -10
      this._doScrollLink()
    }, 80)
  }

  // 初始化编辑器
  _initEditor (id, val) {
    let editor = ace.edit(id)
    let aceSession = editor.getSession()
    let aceRenderer = editor.renderer
    // editor.setOption('scrollPastEnd', true)
    aceRenderer.setShowPrintMargin(false)

    aceRenderer.setShowGutter(false)
    aceSession.setUseWrapMode(true)
    aceSession.setNewLineMode('unix')
    aceSession.setMode('ace/mode/markdown')
    aceSession.$selectLongWords = true
    aceRenderer.setPadding(15)
    editor.setTheme('ace/theme/solarized_dark')
    if (val) {
      aceSession.setValue(val)
    }
    return editor
  }
}
