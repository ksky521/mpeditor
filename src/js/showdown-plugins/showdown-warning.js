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
                    .map(text => {
                        if (/^!>/.test(text)) {
                            text = `<blockquote style="color:#f56c6c;border-left-color: #f56c6c;background-color:#fef0f0"><p>${text.replace(
                                /^!>/,
                                ''
                            )}</p></blockquote>`;
                        }
                        else if (/^\?>/.test(text)) {
                            text = `<blockquote style="color:#67c23a;border-left-color: #67c23a;background-color:#f0f9eb"><p>${text.replace(
                                /^\?>/,
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
