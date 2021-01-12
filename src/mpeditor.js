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
// html
import tmpl from './mpeditor.html';

const LS = window.localStorage;

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
