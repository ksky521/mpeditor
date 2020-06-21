import showdown from 'showdown';
const colors = {
    green: '#67C23A',
    blue: '#409EFF',
    red: '#ff656a',
    yellow: '#E6A23C',
    success: '#67C23A',
    danger: '#F56C6C',
    info: '#909399',
    warning: '#E6A23C',
    gray: '#999999',
};
showdown.subParser('githubCodeBlocks', function (text, options, globals) {
    'use strict';

    // early exit if option is not enabled
    if (!options.ghCodeBlocks) {
        return text;
    }

    text = globals.converter._dispatch('githubCodeBlocks.before', text, options, globals);

    text += '¨0';

    text = text.replace(/(?:^|\n)(?: {0,3})(```+)(?: *)([^\s`]*)\n([\s\S]*?)\n(?: {0,3})\1/g, function (
        wholeMatch,
        delim,
        language,
        codeblock
    ) {
        var end = options.omitExtraWLInCodeBlocks ? '' : '\n';

        // First parse the github code block
        codeblock = showdown.subParser('encodeCode')(codeblock, options, globals);
        codeblock = showdown.subParser('detab')(codeblock, options, globals);
        codeblock = codeblock.replace(/^\n+/g, ''); // trim leading newlines
        codeblock = codeblock.replace(/\n+$/g, ''); // trim trailing whitespace

        codeblock =
            '<pre><code' +
            (language ? ' class="' + language + ' language-' + language + '"' : '') +
            '>' +
            codeblock +
            end +
            '</code></pre>';

        codeblock = showdown.subParser('hashBlock')(codeblock, options, globals);

        // Since GHCodeblocks can be false positives, we need to
        // store the primitive text and the parsed text in a global var,
        // and then return a token
        return '\n\n¨G' + (globals.ghCodeBlocks.push({text: wholeMatch, codeblock: codeblock}) - 1) + 'G\n\n';
    });
    text = text.replace(/(?:^|\n)(?: {0,3})(~~~+)(?: *)([^~]*?)\n([\s\S]*?)\n(?: {0,3})\1/g, function (
        wholeMatch,
        delim,
        language,
        codeblock
    ) {
        language = language.trim();
        let style = '';
        if (/^(green|blue|red|yellow|warning|info|success|danger)$/.test(language)) {
            let color;
            // 自定义颜色
            if (colors[language]) {
                color = colors[language];
            }
            style += !color ? '' : `color: ${color};`;
        } else if (language === 'center') {
            style += 'text-align:center;';
        } else {
            style += language;
        }
        globals.converter._useDivider = false;
        codeblock = globals.converter.makeHtml(codeblock);
        globals.converter._useDivider = true;

        codeblock = codeblock.replace(/<p>\s*<\/p>/g, '').replace('<div class="mpe-section-divider"></div>', '');
        return `<section style="${style ? style : ''}">${codeblock}</section>`;
    });

    // attacklab: strip sentinel
    text = text.replace(/¨0/, '');

    return globals.converter._dispatch('githubCodeBlocks.after', text, options, globals);
});
