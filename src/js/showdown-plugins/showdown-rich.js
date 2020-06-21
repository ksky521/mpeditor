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
function styleParser(css) {
    css = css.split(';');
    css = css
        .map((style) => {
            if (/^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})$/.test(style)) {
                // 颜色
                let color = style;
                // 自定义颜色
                if (colors[style]) {
                    color = colors[style];
                }
                return `color:${color}`;
            } else if (/^[\d.]+(px|em|%)$/.test(style)) {
                return `font-size:${style}`;
            }

            return style;
        })
        .filter((v) => {
            return v !== '';
        });
    return css.join(';');
}

showdown.extension('rich', () => {
    return [
        {
            type: 'lang',
            filter(text) {
                text = text.replace(/\[("|')(.+?)\1\s*(.+?)]/g, (m, quote, css, text) => {
                    css = styleParser(css);
                    if (css) {
                        return `<span style="${css}">${text}</span>`;
                    }
                    return text;
                });

                text = text.replace(/(?:^|\n)((-|=){2,})([^\s|\=\-]+)\1(?:\n|$)/g, (m, $1, $2, $3) => {
                    /* eslint-disable max-len */
                    return `
<section style="height:32px;">
    <section style="margin-top:20px;width:100%;border-top:${
        $2 === '=' ? 'dashed' : 'solid'
    } 1px #515151;" data-width="100%">
        <section style="margin-top: -15px; text-align: center;"><section style="background-color:#fefefe;display:inline-block;padding:0px 5px;">
        <p>${$3}</p>
        </section></section>
    </section>
</section>
`;
                });
                return text;
            },
        },
        // {
        //   type: 'output',
        //   filter (text) {
        //     return text.replace(/<li>(.+?)<\/li>/ig, (m, txt) => {
        //       return `<li><section><section class="mpe-wechat-li" style="font-size:16px;"><span>${txt}</span></section></section></li>`
        //     })
        //   }
        // },
        {
            type: 'output',
            filter(text) {
                // text = text.split('<!--FT-PLACEHOLDER-->');
                // if (text.length === 2) {
                //     text[1] = `<section>
                //             <section style="font-size:12px;color:#8e8e8e">
                //             ${text[1]}
                //             </section>
                //         </section>`;
                // }
                // text = text.join('\n');
                text = text.replace(/<p>\s*\[center]((.+\n)+.*?)\[\/center]\s*<\/p>/gi, function (m, txt) {
                    return `<section style="text-align:center;">${txt}</section>`;
                });
                return text;
            },
        },
    ];
});
