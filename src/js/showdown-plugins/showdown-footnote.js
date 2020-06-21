let showdown = require('showdown');

let converter = new showdown.Converter();

showdown.extension('footnote', function () {
    return [
        {
            type: 'lang',
            filter: function filter(text) {
                return text.replace(/^\[\^([\d\w]+)]:\s*((\n+(\s{2,4}|\t).+)+)$/gm, function (
                    str,
                    name,
                    rawContent,
                    _,
                    padding
                ) {
                    let content = converter.makeHtml(rawContent.replace(new RegExp('^' + padding, 'gm'), ''));
                    return (
                        '<div class="footnote" id="footnote-'
                        + name
                        + '"><a href="#footnote-'
                        + name
                        + '"><sup>['
                        + name
                        + ']</sup></a>:'
                        + content
                        + '</div>'
                    );
                });
            },
        },
        {
            type: 'lang',
            filter: function filter(text) {
                return text.replace(/^\[\^([\d\w]+)]:( |\n)((.+\n)*.+)$/gm, function (str, name, _, content) {
                    return (
                        '<small class="footnote" id="footnote-'
                        + name
                        + '"><a href="#footnote-'
                        + name
                        + '"><sup>['
                        + name
                        + ']</sup></a>: '
                        + content
                        + '</small>'
                    );
                });
            },
        },
        {
            type: 'lang',
            filter: function filter(text) {
                return text.replace(/\[\^([\d\w]+)]/m, function (str, name) {
                    return '<a href="#footnote-' + name + '"><sup>[' + name + ']</sup></a>';
                });
            },
        },
    ];
});
