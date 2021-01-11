const autoCloseTagRe = /^<([A-Za-z][A-Za-z0-9\-]*)[^\<]*\/>$/;
const openCloseTagRe = /^<([A-Za-z][A-Za-z0-9\-]*)([^\<]*)>(.*?)<\/\1>$/;

exports.htmlInlineParser = function (html) {
    if ('<' === html.charAt(0)) {
        // 自闭和
        let m = autoCloseTagRe.exec(html);
        // console.log(m,html)
        if (m && m[1]) {
            return {tag: m[1]};
        }
        m = openCloseTagRe.exec(html);
        if (m) {
            let [_0, tag, attrs, content] = m;
            attrs = attrs.trim();
            if (attrs !== '') {
                attrs = attrs
                    .split(/\s+/)
                    .map(a => {
                        if (a.indexOf('=') !== -1) {
                            const idx = a.indexOf('=');
                            return [a.slice(0, idx), a.slice(idx + 1)];
                        }
                        return [a, ''];

                    })
                    .reduce((prev, next) => {
                        prev[next[0]] = next[1] ? next[1].replace(/^['"]|['"]$/g, '') : true;
                        return prev;
                    }, {});
            }

            return {
                tag,
                attrs: attrs ? attrs : {},
                content: content.trim()
            };
        }
        return false;
    }
    return false;
};
