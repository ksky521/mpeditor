import './css/common.less';
import './css/mpeditor.less';
import './css/theme-white.less';
import Clipboard from 'clipboard';
import $ from 'jQuery';
import pangu from 'pangu';
/* globals CodeMirror, $, jQuery */
// markdown-it
import markdownIt from 'markdown-it';
import mdImgSize from 'markdown-it-imsize';

import mdHighlight from './js/plugins/highlight';
import mdFootnote from './js/plugins/footnote';
import mdBlockQuote from './js/plugins/blockquote';
import mdList from './js/plugins/list';
import mdImage from './js/plugins/image';
import blockifyTag from './js/plugins/blockify-tag';
import mdTableContainter from './js/plugins/table-container';

// output plugin
import downloadBlobAsFile from './js/download.js';

// 语法高亮

const LS = window.localStorage;
LS.mpe_previewClass = LS.mpe_previewClass || '';
LS.mpe_editorClass = LS.mpe_editorClass || '';
/* eslint-disable  max-len */
const tmpl = `<div class="mpeditor">
<div class="mpe-nav-wrap" eid="nav">
  <div class="mpe-nav">
    <ul class="mpe-nav-tools mpe_fl">
    </ul>
    <ul class="mpe-nav-tools mpe_fr">
      <li class="mpe-nav-item mpe-nav-text">
        <span>编辑器主题</span>
      </li>
      <li class="mpe-nav-item mpe-nav-select">
        <select eid="editorTheme">
          <option value="default">default</option>
          <option value="solarized">solarized</option>
          <option value="monokai">monokai</option>
          <option value="twilight">twilight</option>
          <option value="material">material</option>
          <option value="night">night</option>
          <option value="midnight">midnight</option>
        </select>
      </li>
      <li class="mpe-nav-item">
        <a href="javascript:void(0)" eid="downloadBtn" title="下载markdown文件">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M683.84 170.666667L853.333333 344.704V789.333333a64 64 0 0 1-64 64H234.666667a64 64 0 0 1-64-64V234.666667a64 64 0 0 1 64-64h449.173333zM320 234.645333L234.666667 234.666667v554.666666l85.333333-0.021333V533.333333h384v255.978667L789.333333 789.333333V370.730667l-85.333333-87.637334V384H320v-149.354667zM640 597.333333H384v191.978667h256V597.333333z m-42.666667 64v64h-170.666666v-64h170.666666z m42.666667-426.666666H384v85.333333h256v-85.333333z" /></svg>
        </a>
      </li>
      <li class="mpe-nav-item">
        <a href="javascript:void(0)" eid="pcBtn" title="切换PC视图" >
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M661.333333 768v64H362.666667v-64h298.666666z m149.333334-576a64 64 0 0 1 64 64v405.333333a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V256a64 64 0 0 1 64-64h597.333334z m0 64H213.333333v405.333333h597.333334V256z m-149.333334 170.666667v64H362.666667v-64h298.666666z" /></svg>
        </a>
      </li>
      <li class="mpe-nav-item">
        <a href="javascript:void(0)" eid="mobileBtn" title="切换手机视图" style="display:none">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M704 149.333333a64 64 0 0 1 64 64v597.333334a64 64 0 0 1-64 64H320a64 64 0 0 1-64-64V213.333333a64 64 0 0 1 64-64h384z m0 64H320v597.333334h384V213.333333z m-192 469.333334a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m85.333333-437.333334v64h-170.666666v-64h170.666666z" /></svg>
        </a>
      </li>

      <li class="mpe-nav-item">
        <a href="javascript:void(0)" eid="copyBtn" title="复制内容">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M746.666667 149.333333a64 64 0 0 1 64 64v181.333334a64 64 0 0 1 64 64v49.664l-64 58.496v-87.573334l-239.104 197.376a95.978667 95.978667 0 0 1-117.632 3.050667l-3.84-2.986667-236.757334-192V800h372.330667l62.805333 64H213.333333a64 64 0 0 1-64-64v-341.333333a64 64 0 0 1 64-64V213.333333a64 64 0 0 1 64-64h469.333334z m126.869333 467.861334l44.928 45.610666-174.08 171.456-105.536-104.106666 44.970667-45.568 60.586666 59.818666 129.130667-127.210666zM746.666667 213.333333H277.333333v240.853334l213.184 172.906666a32 32 0 0 0 37.845334 1.984l2.56-1.92L746.666667 449.109333V213.333333z m-149.333334 192v64H362.666667v-64h234.666666z m64-128v64H362.666667v-64h298.666666z" /></svg>
        </a>
      </li>
      <li class="mpe-nav-item">
        <a href="javascript:void(0)" eid="clearBtn" title="清空内容">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M341.013333 394.666667l27.754667 393.450666h271.829333l27.733334-393.450666h64.106666L704.426667 792.618667a64 64 0 0 1-63.829334 59.498666H368.768a64 64 0 0 1-63.829333-59.52L276.885333 394.666667h64.128z m139.306667 19.818666v298.666667h-64v-298.666667h64z m117.013333 0v298.666667h-64v-298.666667h64zM181.333333 288h640v64h-640v-64z m453.482667-106.666667v64h-256v-64h256z" />
        </a>
      </li>
      <li class="mpe-nav-item">
        <a href="//github.com/ksky521/mpeditor" target="_blank" title="本项目github" style="width:18px;">
          <svg style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2535"><path d="M1.3 525.3c0 223 142.9 412.6 342.1 482.2 26.8 6.8 22.7-12.4 22.7-25.4l0-88.5C211.2 911.8 205 809.2 194.5 792.1c-21.1-35.9-70.7-45-55.9-62.1 35.3-18.2 71.2 4.6 112.9 66.1 30.2 44.6 88.8 37.1 118.7 29.6 6.5-26.8 20.5-50.7 39.6-69.4-160.3-28.5-227.3-126.5-227.3-243 0-56.4 18.6-108.4 55.2-150.3-23.2-69.2 2.2-128.2 5.6-137 66.3-6 135.1 47.4 140.5 51.6 37.7-10.1 80.7-15.6 128.8-15.6 48.4 0 91.6 5.6 129.5 15.8 12.9-9.8 76.8-55.6 138.4-50 3.3 8.8 28.1 66.5 6.3 134.7 37 42 55.8 94.3 55.8 151 0 116.7-67.3 214.8-228.2 243.1 26.9 26.5 43.5 63.3 43.5 104l0 128.4c0.9 10.2 0 20.5 17.2 20.5 202.1-68.1 347.6-259.1 347.6-484.1 0-282.1-228.7-510.7-510.7-510.7C229.9 14.6 1.3 243.2 1.3 525.3z" p-id="2536"></path></svg>
        </a>
      </li>
    </ul>
  </div>
</div>
<div class="mpe-wrap">
  <div eclass="mpe-col" class="mpe-editor-col mpe-col ${LS.mpe_editorClass}" data-index=1>
    <div class="mpe-editor-wrap">
      <textarea eid="editor" class="mpe-editor" type="textarea" placeholder="Your markdown here." style="display: none;height:100%;"></textarea>
    </div>
  </div>
  <div eclass="mpe-col" class="mpe-preview-col mpe-col ${LS.mpe_previewClass}" data-index=2>
    <div class="mpe-preview-wrap mobile" eid="previewContainer">
      <div class="mpe-preview" eid="preview"></div>
    </div>
  </div>
</div>
<div class="mpe-toast" eid="toast">
  <i class="mpe-toast-icon"><svg style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="524"><path d="M512 960C264.96 960 64 759.04 64 512S264.96 64 512 64s448 200.96 448 448S759.04 960 512 960zM512 128.288C300.416 128.288 128.288 300.416 128.288 512c0 211.552 172.128 383.712 383.712 383.712 211.552 0 383.712-172.16 383.712-383.712C895.712 300.416 723.552 128.288 512 128.288zM726.976 393.184c-12.544-12.448-32.832-12.32-45.248 0.256l-233.28 235.84-103.264-106.112c-12.352-12.704-32.608-12.928-45.248-0.64-12.672 12.32-12.96 32.608-0.64 45.248l126.016 129.504c0.064 0.096 0.192 0.096 0.256 0.192 0.064 0.064 0.096 0.192 0.16 0.256 2.016 1.984 4.512 3.2 6.88 4.544 1.248 0.672 2.24 1.792 3.52 2.304 3.872 1.6 8 2.4 12.096 2.4 4.064 0 8.128-0.8 11.968-2.336 1.248-0.512 2.208-1.536 3.392-2.176 2.4-1.344 4.896-2.528 6.944-4.544 0.064-0.064 0.096-0.192 0.192-0.256 0.064-0.096 0.16-0.128 0.256-0.192l256.224-259.008C739.648 425.856 739.52 405.6 726.976 393.184z" p-id="525"></path></svg></i>
  <p class="mpe-toast-text">已保存</p>
</div>
</div>
`;
/* eslint-enable  max-len */

const KEYS_MAPS = {
    'Cmd-S': 'save',
    'Cmd-B': 'bold',
    'Cmd-I': 'italicize',
    'Cmd-\'': 'blockquote',
    'Cmd-U': 'strikethrough',
    // 'Cmd-U': 'unorderedList',
    'Cmd-P': 'image',
    'Cmd-H': 'headerbox',
    'Cmd-K': 'link'
};
export default class Editor {
    actions = {
        save(instance) {
            this._save();
        },
        bold() {
            this.toggleAround('**', '**');
        },
        italicize() {
            this.toggleAround('*', '*');
        },
        strikethrough() {
            this.toggleAround('~~', '~~');
        },
        code() {
            this.toggleAround('```\r\n', '\r\n```');
        },
        blockquote() {
            this.toggleBefore('> ');
        },
        orderedList() {
            this.toggleBefore('1. ');
        },
        unorderedList() {
            this.toggleBefore('* ');
        },
        image() {
            this.toggleAround('![', '](http://)');
        },
        link() {
            this.toggleAround('[', '](http://)');
        },
        headerbox() {
            this.toggleAround('<header-box>', '</header-box>');
        }
    };
    constructor(node, {text, updateDelayTime = 300} = {}) {
        let $container = $(node).html(tmpl);
        this.scale = 1;
        this.index = 1;

        this.$container = $container;
        let that = this;
        $container.find('[eid]').each((i, dom) => {
            dom = $(dom);
            let id = dom.attr('eid');
            that['$' + id] = dom;
        });
        // 在创建codeMirror之前
        const extraKeys = this.registerKeyMaps();

        this.resize();
        let editor = (this.editor = this._initEditor(this.$editor[0], text, extraKeys));
        this.converter = this._initMarkdownRender();
        if (text) {
            this.updatePreview(text);
        }

        let timer;
        editor.on('change', () => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => that.updatePreview(), updateDelayTime);
        });

        // 跟滚动相关
        this._scrollingHelper = $('<div>');
        this._isPreviewMoving = false;
        this._isEditorMoving = false;
        this._bindEvent();
        // 自动保存
        this._autoSave();
    }

    _setCurrentIndex(index) {
        this.index = parseInt(index, 10);
    }
    setValue(content) {
        this.editor.setValue(content);
        this.updatePreview();
        return this;
    }
    render(content) {
        let text = this.converter.render(content || this.editor.getValue());
        return text;
    }
    updatePreview(content) {
        // this._isInput = false;
        this._isUpdatePreview = true;
        // console.log(this.editor.getValue())
        let val = this.render(content);
        this.$preview.html(val);
        // pangu
        pangu.spacingNode(this.$preview[0]);
        // TODO 收集footnote
        return this;
    }
    toggleAround(start, end) {
        let doc = this.editor.getDoc();
        let cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            let selection = doc.getSelection();
            if (selection.startsWith(start) && selection.endsWith(end)) {
                doc.replaceSelection(selection.substring(start.length, selection.length - end.length), 'around');
            }
            else {
                doc.replaceSelection(start + selection + end, 'around');
            }
        }
        else {
            // If no selection then insert start and end args and set cursor position between the two.
            doc.replaceRange(start + end, {line: cursor.line, ch: cursor.ch});
            doc.setCursor({line: cursor.line, ch: cursor.ch + start.length});
        }
    }
    toggleBefore(insertion) {
        let doc = this.editor.getDoc();
        let cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            let selections = doc.listSelections();
            let remove = null;
            this.editor.operation(function () {
                selections.forEach(function (selection) {
                    let pos = [selection.head.line, selection.anchor.line].sort();

                    // Remove if the first text starts with it
                    if (remove == null) {
                        remove = doc.getLine(pos[0]).startsWith(insertion);
                    }

                    for (let i = pos[0]; i <= pos[1]; i++) {
                        if (remove) {
                            // Don't remove if we don't start with it
                            if (doc.getLine(i).startsWith(insertion)) {
                                doc.replaceRange('', {line: i, ch: 0}, {line: i, ch: insertion.length});
                            }
                        }
                        else {
                            doc.replaceRange(insertion, {line: i, ch: 0});
                        }
                    }
                });
            });
        }
        else {
            let line = cursor.line;
            if (doc.getLine(line).startsWith(insertion)) {
                doc.replaceRange('', {line: line, ch: 0}, {line: line, ch: insertion.length});
            }
            else {
                doc.replaceRange(insertion, {line: line, ch: 0});
            }
        }
    }
    registerKeyMaps(keyMaps = KEYS_MAPS) {
        const extraKeys = {};
        Object.keys(keyMaps).forEach(key => {
            const actionName = keyMaps[key];
            if (typeof this.actions[actionName] !== 'function') {
                throw `MPEditor CodeMirror: ${actionName} is not a registered action`;
            }

            let realName = key
                .replace('Cmd-', CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault ? 'Cmd-' : 'Ctrl-')
                .replace('Alt-', CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault ? 'Shift-' : 'Alt-');
            extraKeys[realName] = this.actions[actionName].bind(this);
        });
        return extraKeys;
    }
    // 改变大小
    resize(height) {
        height = height || this.$container.height();
        // let $nav = this.$nav;
        // height = height;
        // this.$editor.height(height);
        this.$previewContainer.height(height);
        // this.$container.find('[eclass=mpe-col]').height(height);
        // this.editor && this.editor.resize();
    }
    // 私有方法

    _autoSave() {
        // this._autoSaveTimer = setInterval(() => {
        let text = this.editor.getValue();
        if (text !== '') {
            LS.mpe_content = text;
        }
        // }, 10e3)
    }
    _handleScroll() {
        const markdownEditor = this.editor;

        const $preview = this.$preview;
        const $container = this.$container;

        const cmData = markdownEditor.getScrollInfo();
        const editorToTop = cmData.top;
        const editorScrollHeight = cmData.height - cmData.clientHeight;
        this.scale = ($preview[0].offsetHeight - $container[0].offsetHeight + 40) / editorScrollHeight;
        const $previewContainer = this.$previewContainer;
        if (this.index === 1) {
            $previewContainer.scrollTop(editorToTop * this.scale);
        }
        else {
            markdownEditor.scrollTo(null, $previewContainer.scrollTop() / this.scale + 40);
        }
    }
    _bindEvent() {
        const markdownEditor = this.editor;
        const $preview = this.$preview;
        // let $editor = this.$editor
        const that = this;
        // TODO
        this.$container.find('[eclass=mpe-col]').mouseover(function () {
            that._setCurrentIndex(this.dataset.index);
        });

        markdownEditor.on('scroll', this._handleScroll.bind(this));

        $preview.parent().on('scroll', this._handleScroll.bind(this));
        // 工具栏
        const clipboard = new Clipboard(this.$copyBtn[0], {
            action: 'cut',
            target: () => this.$preview[0]
        });
        clipboard.on('success', e => {
            this._createTips(this.$copyBtn, '复制成功');
        });
        this.$editorTheme.on('change', function () {
            let theme = this.value;
            const removeClasses = that.editor.display.wrapper.className.split(/\s+/).filter(a => /^cm\-s\-/.test(a));
            $(that.editor.display.wrapper).removeClass(removeClasses.join(' ')).addClass(`cm-s-${theme}`);
            // 存储
            LS.mpe_editorTheme = theme;
        });
        this.$mobileBtn.on('click', () => {
            this.$previewContainer.addClass('mobile');
            this.$mobileBtn.hide();
            this.$pcBtn.show();
        });
        this.$pcBtn.on('click', () => {
            this.$previewContainer.removeClass('mobile');
            this.$pcBtn.hide();
            this.$mobileBtn.show();
        });
        this.$downloadBtn.on('click', () => {
            let text = this.editor.getValue();
            if (text.trim()) {
                downloadBlobAsFile(text, 'untitled.md');
            }
            else {
                alert('写点啥再下载吧');
            }
        });
        this.$clearBtn.on('click', () => {
            delete LS.mpe_content;
            this.setValue('');
        });
    }
    _save() {
        this._autoSave();
        let $toast = this.$toast.show();
        setTimeout(() => $toast.hide(), 800);
    }
    _createTips(node, text, dir = 'bottom', timeout = 2000) {
        let tmpl = `
        <div class="mpe-tooltip mpe-tooltip_${dir}" >
            <div class="mpe-tooltip-inner">${text}</div>
        </div>
    `;
        let pos = $(node).position();

        let $tip = $(tmpl).appendTo(this.$container);
        $tip.css({
            top: pos.top - 20,
            left: pos.left - $(node).width() / 2
        }).animate({opacity: 1, top: pos.top + $(node).height() + 20}, 300);
        setTimeout(() => {
            $tip.animate({opacity: 0}, 300, () => {
                $tip.remove();
            });
        }, timeout);
        return $tip;
    }
    _initMarkdownRender() {
        let md = markdownIt({
            html: true, // Enable HTML tags in source
            xhtmlOut: false, // Use '/' to close single tags (<br />).
            // This is only for full CommonMark compatibility.
            breaks: false, // Convert '\n' in paragraphs into <br>
            langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
            // useful for external highlighters.
            linkify: false, // Autoconvert URL-like text to links
            // Enable some language-neutral replacement + quotes beautification
            // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
            typographer: false,

            // Double + single quotes replacement pairs, when typographer enabled,
            // and smartquotes on. Could be either a String or an Array.
            //
            // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
            // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
            quotes: '“”‘’'
        });
        // 添加plugin
        md.use(mdBlockQuote) // blockquote嵌套
            .use(mdHighlight) // 语法高亮
            .use(mdFootnote) // footnote
            .use(mdTableContainter)
            .use(mdImage) // 图示
            .use(mdList) // li列表处理
            .use(blockifyTag) // 自定义样式
            .use(mdImgSize); // 图片

        return md;
    }
    // 初始化编辑器
    _initEditor(id, val, extraKeys) {
        let theme = LS.mpe_editorTheme ? LS.mpe_editorTheme : 'default';
        // eslint-disable-next-line
        let editor = CodeMirror.fromTextArea(id, {
            lineNumbers: false,
            lineWrapping: true,
            styleActiveLine: true,
            theme,
            extraKeys,
            mode: 'text/x-markdown'
        });

        if (val) {
            editor.setValue(val);
        }
        return editor;
    }
}
