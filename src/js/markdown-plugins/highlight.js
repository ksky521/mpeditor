export default function (md) {
    md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
        let token = tokens[idx];
        let info = token.info ? String(token.info).trim() : '';
        let lang = '';

        if (info) {
            lang = info.split(/\s+/g)[0];
        }
        const str = token.content.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const lines = str.split('\n');
        const codeLines = [];
        const numbers = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            codeLines.push(`<code><span class="code-snippet_outer">${line || '<br>'}</span></code>`);
            numbers.push('<li></li>');
        }
        return `<section class="code-snippet__fix code-snippet__js">
            <ul class="code-snippet__line-index code-snippet__js">
            ${numbers.join('')}
            </ul>
            <pre class="code-snippet__js" data-lang="${lang}">
            ${codeLines.join('')}
            </pre></section>`;
    };
}
