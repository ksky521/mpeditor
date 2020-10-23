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
        .map(style => {
            if (/^(green|blue|red|yellow|warning|info|success|danger|#[\w\d]{6}|#[\d\w]{3})$/.test(style)) {
                // 颜色
                let color = style;
                // 自定义颜色
                if (colors[style]) {
                    color = colors[style];
                }
                return `color:${color}`;
            }
            else if (/^[\d.]+(px|em|%)$/.test(style)) {
                return `font-size:${style}`;
            }

            return style;
        })
        .filter(v => {
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
                console.log(text);
                // ===[header-box] 学习下
                text = text.replace(/(?:^|\n)(={2,})\[(.+?)\]\s+(.+?)(?:\n|$)/g, (m, $1, type, text) => {
                    console.log(text, type);
                    /* eslint-disable max-len */
                    switch (type) {
                        case 'header-box':
                            return `
<section style="display: flex;justify-content: center;align-items: center;width: 100%;padding: 10px;">
    <section style="display: flex;justify-content: center;align-items: center;">
        <section style="background: #409EFF;">
            <section style="text-align: left;padding: 7px 17px 5px 17px;transform: translate(-4.1px, -4.1px);background: #F9F9F9;border: 1px solid #333333;">
                <p style="font-size: 16px;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;color: #333;line-height: 22px;letter-spacing: 1px;margin-bottom:0;">${text}</p>
            </section>
        </section>
    </section>
</section>`;
                        case 'header-num':
                            // 01. a =>
                            const [n, t] = text.split('. ');
                            return `
<section style="display: flex;justify-content: center;align-items: center;width: 100%;"><section>
    <section style="margin-right: 10px;margin-left: 10px;display: flex;flex-direction: column;align-items: center;">
        <section><p style="font-size: 15px;text-align: center;margin-bottom:0;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;">${n}</p></section>
    </section>
    <section style="border-top: 1px solid #000;padding-top: 2px;">
        <section style="padding-right: 15px;padding-left: 15px;border-bottom: 8px solid #409EFF;">
            <p style="margin-bottom: -8px;font-size: 15px;text-align: center;letter-spacing: 1.5px;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;">${t}</p>
        </section>
    </section>
</section></section>`;
                        case 'qrcode-box':
                            // ==qrcode-box

                            return `
<section style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: flex-start;" >
    <section style="width: 304px;background-repeat: no-repeat;background-size: 100% 100%;height: 22px;margin: 0 0 -20px 0;z-index: 20;"></section>
    <section style="width: 300px;display: flex;flex-direction: column;align-items: center;justify-content: flex-start;">
        <section style="width: 100%;display: flex;flex-direction: row;align-items: center;justify-content: space-between;padding: 12px 18px;background: #ecf8ff;border-radius: 11px;border: 1px solid #50bfff;">
            <section style="display: flex;flex-direction: column;align-items: flex-start;justify-content: center;">
                <section style="display: flex;flex-direction: column;align-items: flex-start;justify-content: center;">
                    <p style="font-size: 18px;font-weight: 400;color: #5e6d82;margin-bottom:0;">扫描二维码</p>
                    <p style="font-size: 18px;font-weight: 400;color: #5e6d82;margin-bottom:0;">获取更多精彩</p>
                </section>
                <section style="display: flex;flex-direction: row;align-items: center;justify-content: center;flex-wrap: nowrap;border: 1px solid #50bfff;padding: 3px 8px;margin: 14px 0 0 0;">
                    <p style="font-size: 15px;font-weight: 400;color: #5e6d82;letter-spacing: 2px;margin-bottom:0;">三水清</p>
                </section>
            </section>
            <section style="width: 120px;height: 120px;">
                <img src="https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p" alt="no" style="width: 100%;height: 100%;">
            </section>
        </section>
    </section>
    <section style="width: 304px;background-repeat: no-repeat;background-size: 100% 100%;height: 25px;margin: -23px 0 0 0;z-index: 30;"></section>
</section>`;
                    }
                    return m;
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
</section>`;
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
