import showdown from 'showdown';
/* eslint-disable max-len */

showdown.extension('warning', () => {
    return [
        {
            type: 'lang',
            filter(text) {
                // /^!&gt;/
                return text
                    .split('\n')
                    .map((text) => {
                        if (/^!>/.test(text)) {
                            text = `<blockquote style="border-left:6px solid #F56C6C;background-color:#fef0f0"><p>${text.replace(
                                /^!>/,
                                ''
                            )}</p></blockquote>`;
                        }
                        return text;
                    })
                    .join('\n');
            },
        },
    ];
});
