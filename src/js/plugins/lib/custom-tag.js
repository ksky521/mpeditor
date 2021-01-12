export default function (tokens, idx) {
    const {tag, content, attrs} = tokens[idx].meta;
    /* eslint-disable max-len */

    switch (tag) {
        case 'header-box':
            if (attrs['sub-title'] && typeof attrs['sub-title'] === 'string') {
                return `
                <section style="display: flex;justify-content: center;align-items: center;width: 100%;margin:0 auto;"><section>
                <section style="margin-right: 10px;margin-left: 10px;display: flex;flex-direction: column;align-items: center;">
                    <section><p style="font-size: 15px;text-align: center;margin-bottom:0;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;">${attrs['sub-title']}</p></section>
                </section>
                <section style="border-top: 1px solid #000;padding-top: 2px;">
                    <section style="padding-right: 15px;padding-left: 15px;border-bottom: 8px solid #409EFF;">
                        <p style="margin-bottom: -8px;font-size: 15px;text-align: center;letter-spacing: 1.5px;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;">${content}</p>
                    </section>
                </section>
            </section></section>`;
            }
            return `
            <section style="display: flex;justify-content: center;align-items: center;width: 100%;padding: 10px;margin:0 auto;">
            <section style="display: flex;justify-content: center;align-items: center;">
                <section style="background: #409EFF;">
                    <section style="text-align: left;padding: 7px 17px 5px 17px;transform: translate(-4.1px, -4.1px);background: #F9F9F9;border: 1px solid #333333;">
                        <p style="font-size: 16px;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;color: #333;line-height: 22px;letter-spacing: 1px;margin-bottom:0;">${content}</p>
                    </section>
                </section>
            </section>
        </section>`;
        case 'image-flow':
            if (attrs.images) {
                if (attrs.vertical) {
                    let wrappedContent = '';
                    const {width = 320, height = 344} = attrs;
                    attrs.images.split(',').forEach(src => {
                        wrappedContent += `<section style="clear: both;margin:0 !important; min-height: 1em;">
                        <img  src="${src}" style="width: ${width}px; vertical-align: top; height: auto !important;">
                    </section>`;
                    });
                    return `
                            <section style="text-align: center; border-width: 1px; border-style: solid; border-color: rgb(240, 240, 240);overflow:hidden;">
                                <section style="display: inline-block;overflow:hidden;">
                                    <section style="overflow: hidden scroll; height: ${height}px; display: inline-block; color: inherit;">
                                        <section style="padding: 3px 2px; color: inherit; border-color: rgb(252, 180, 43);">
                                        ${wrappedContent}
                                        </section>
                                    </section>
                                </section>
                                <p style="margin: 15px auto 5px; clear: both; min-height: 1em;margin:0 !important;color:#888;">${
    content ? content : '上下滑动展示更多'
}</p>
                            </section>
                            `;
                }
                let wrappedContent = '';
                attrs.images.split(',').forEach(src => {
                    wrappedContent += `<section class="imageflow-item"><img src="${src}" class="imageflow-img" /></section>`;
                });

                return `
                    <section class="imageflow">
                        <section class="imageflow-wrap">
                            <section class="imageflow-box">
                                ${wrappedContent}
                            </section>
                        </section>
                        <p class="imageflow-text">${content ? content : '左右滑动展示更多'}</p>
                    </section>
                    `;
            }

        case 'qrcode-box':
            return `
<section style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: flex-start;margin:0 auto;" >
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
}
