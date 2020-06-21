import showdown from 'showdown';

showdown.extension('prettify', () => {
    return [
        {
            type: 'output',
            filter: source => {
                return source.replace(/(<pre[^>]*>)?[\n\s]?<code([^>]*)>/gi, function (match, pre, codeClass) {
                    if (pre) {
                        return (
                            '<pre class="linenums"><code'
                            + codeClass
                            + '>'
                        );
                    }
                    return ' <code class="code-in-text">';
                });
            },
        },
    ];
});
