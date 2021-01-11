import {htmlInlineParser} from '../utils';
import customTag from './lib/custom-tag';
const diyTags = ['header-box', 'qrcode-box'];
export default (md, opts) => {
    const tokenize = (state, start) => {
        let token;
        const srcLine = state.src.slice(state.bMarks[start], state.eMarks[start]);
        if (
            (srcLine.charCodeAt(0) === 0x2d /* - */ && srcLine.charCodeAt(1) === 0x2d)
            || (srcLine.charCodeAt(0) === 0x3d /* = */ && srcLine.charCodeAt(1) === 0x3d)
        ) {
            // console.log(srcLine);
            const m = /(?:^|\n)((-|=){2,})([^\s|\=\-]+)\1(?:\n|$)/.exec(srcLine);
            if (m && m[1]) {
                token = state.push('EOFLine', '', 0);
                token.meta = m[2];
                token.block = true;
                token.content = m[3];

                // update line
                state.line++;
                return true;
            }
            return false;
        }
        // console.log(srcLine.charCodeAt(0), srcLine)
        if (
            (srcLine.charCodeAt(0) === 0x21 /* ! */ || srcLine.charCodeAt(0) === 0x3f)
            /* ? */ && srcLine.charCodeAt(1) === 0x3e /* > */
        ) {
            // !> ?>
            token = state.push('customBlockquote', '', 0);
            token.meta = srcLine[0];
            token.block = true;
            token.content = srcLine.replace(/^[\!\?]\>/, '');

            // update line
            state.line++;
            return true;
        }
        if (srcLine.charCodeAt(0) !== 0x3c /* < */) {
            return false;
        }
        const secondCh = srcLine.charCodeAt(1);
        if (
            secondCh === 0x21
            /* ! */ || secondCh === 0x3f
            /* ? */ || secondCh === 0x2f
            /* / */ || !isLetter(secondCh)
        ) {
            return false;
        }
        const a = htmlInlineParser(srcLine);
        if (a && a.tag !== '' && diyTags.indexOf(a.tag) !== -1) {
            // console.log(a);
            token = state.push('blockifyTag', '', 0);
            token.meta = a;
            token.block = true;

            // update line
            state.line++;
            return true;
        }

        return false;
    };

    md.renderer.rules.blockifyTag = customTag;
    md.block.ruler.before('paragraph', 'blockifyTag', tokenize);

    md.renderer.rules.customBlockquote = (tokens, idx) => {
        const meta = tokens[idx].meta;
        const content = tokens[idx].content;
        /* eslint-disable max-len */
        if (meta === '!') {
            return `<blockquote style="color:#f56c6c;quotes: none;border-left:3px solid #f56c6c;border-radius: 3px;padding:0.8em 1em;background-color:#fef0f0"><p style="margin:0;font-size:14px;">${content}</p></blockquote>`;
        }
        return `<blockquote style="color:#67c23a;quotes: none;border-left:3px solid #67c23a;border-radius: 3px;padding:0.8em 1em;background-color:#f0f9eb"><p style="margin:0;font-size:14px;">${content}</p></blockquote>`;

        /* eslint-enable max-len */
    };
    md.block.ruler.before('paragraph', 'customBlockquote', tokenize);

    // 分割线样式
    md.renderer.rules.EOFLine = (tokens, idx) => {
        const {content, meta} = tokens[idx];
        /* eslint-disable max-len */
        return `
<section style="height:32px;">
<section style="margin-top:20px;width:100%;border-top:${
    meta === '=' ? 'dashed' : 'solid'
} 1px #515151;" data-width="100%">
<section style="margin-top: -15px; text-align: center;"><section style="background-color:#fefefe;display:inline-block;padding:0px 5px;">
<p>${content}</p>
</section></section>
</section>
</section>`;
        /* eslint-enable max-len */
    };
    md.block.ruler.before('paragraph', 'EOFLine', tokenize);
};

function isLetter(ch) {
    /* eslint no-bitwise:0 */
    let lc = ch | 0x20; // to lower case
    return lc >= 0x61 /* a */ && lc <= 0x7a;
}
