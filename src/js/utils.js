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
exports.dateFormat = function dateFormat(d = new Date(), pattern = 'yyyy-MM-dd') {
    const type = typeof d;
    if (type === 'string' || type === 'number') {
        d = new Date(d);
    }
    let y = d.getFullYear().toString();
    let o = {
        M: d.getMonth() + 1, // month
        d: d.getDate(), // day
        h: d.getHours(), // hour
        m: d.getMinutes(), // minute
        s: d.getSeconds() // second
    };
    pattern = pattern.replace(/(y+)/gi, (a, b) => y.substr(4 - Math.min(4, b.length)));
    Object.keys(o).forEach(i => {
        pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), (a, b) =>
            o[i] < 10 && b.length > 1 ? '0' + o[i] : o[i]
        );
    });
    return pattern;
};
