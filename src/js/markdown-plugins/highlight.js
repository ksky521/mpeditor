// 缩小highlight包大小，按需引入，900kb->90kb
import highlightjs from 'highlight.js/lib/core';

import bash from 'highlight.js/lib/languages/bash';
import clojure from 'highlight.js/lib/languages/clojure';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import erlang from 'highlight.js/lib/languages/erlang';
import go from 'highlight.js/lib/languages/go';
import gradle from 'highlight.js/lib/languages/gradle';
import groovy from 'highlight.js/lib/languages/groovy';
import haskell from 'highlight.js/lib/languages/haskell';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import julia from 'highlight.js/lib/languages/julia';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lisp from 'highlight.js/lib/languages/lisp';
import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import matlab from 'highlight.js/lib/languages/matlab';
import objectivec from 'highlight.js/lib/languages/objectivec';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import verilog from 'highlight.js/lib/languages/verilog';
import vhdl from 'highlight.js/lib/languages/vhdl';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import diff from 'highlight.js/lib/languages/diff';
highlightjs.configure({
    classPrefix: 'code-snippet__'
});
highlightjs.registerLanguage('bash', bash);
highlightjs.registerLanguage('clojure', clojure);
highlightjs.registerLanguage('cpp', cpp);
highlightjs.registerLanguage('css', css);
highlightjs.registerLanguage('dart', dart);
highlightjs.registerLanguage('dockerfile', dockerfile);
highlightjs.registerLanguage('erlang', erlang);
highlightjs.registerLanguage('go', go);
highlightjs.registerLanguage('gradle', gradle);
highlightjs.registerLanguage('groovy', groovy);
highlightjs.registerLanguage('haskell', haskell);
highlightjs.registerLanguage('java', java);
highlightjs.registerLanguage('javascript', javascript);
highlightjs.registerLanguage('json', json);
highlightjs.registerLanguage('julia', julia);
highlightjs.registerLanguage('kotlin', kotlin);
highlightjs.registerLanguage('lisp', lisp);
highlightjs.registerLanguage('lua', lua);
highlightjs.registerLanguage('makefile', makefile);
highlightjs.registerLanguage('markdown', markdown);
highlightjs.registerLanguage('matlab', matlab);
highlightjs.registerLanguage('objectivec', objectivec);
highlightjs.registerLanguage('perl', perl);
highlightjs.registerLanguage('php', php);
highlightjs.registerLanguage('python', python);
highlightjs.registerLanguage('r', r);
highlightjs.registerLanguage('ruby', ruby);
highlightjs.registerLanguage('rust', rust);
highlightjs.registerLanguage('scala', scala);
highlightjs.registerLanguage('shell', shell);
highlightjs.registerLanguage('sql', sql);
highlightjs.registerLanguage('swift', swift);
highlightjs.registerLanguage('typescript', typescript);
highlightjs.registerLanguage('verilog', verilog);
highlightjs.registerLanguage('vhdl', vhdl);
highlightjs.registerLanguage('xml', xml);
highlightjs.registerLanguage('yaml', yaml);
highlightjs.registerLanguage('diff', diff);

export default function (md) {
    md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
        let token = tokens[idx];
        let info = token.info ? String(token.info).trim() : '';
        let lang = 'bash';

        if (info) {
            lang = info.split(/\s+/g)[0];
        }
        const str = token.content.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let useHljs = false;
        if (lang && highlightjs.getLanguage(lang)) {
            useHljs = true;
        }

        const lines = str.split('\n');
        const codeLines = [];
        const numbers = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            /* eslint-disable max-len */

            codeLines.push(
                `<code><span class="code-snippet_outer">${
                    line
                        ? useHljs
                            ? highlightjs
                                .highlight(lang, line, true)
                                .value.replace('&amp;gt;', '>')
                                .replace('&amp;lt;', '<')
                            : line
                        : '<br>'
                }</span></code>`
            );
            numbers.push('<li></li>');
        }
        return `<section class="code-snippet code-snippet__fix code-snippet__js">
            <ul class="code-snippet__line-index code-snippet__js">
            ${numbers.join('')}
            </ul>
            <pre class="code-snippet__js" data-lang="${lang}">
            ${codeLines.join('')}
            </pre></section>`;
    };
}
