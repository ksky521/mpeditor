'use strict';

module.exports = function implicitFiguresPlugin(md, options) {
    options = options || {};

    function implicitFigures(state) {
        // reset tabIndex on md.render()

        // do not process first and last token
        for (let i = 1, l = state.tokens.length; i < l - 1; ++i) {
            let token = state.tokens[i];

            if (token.type !== 'inline') {
                continue;
            }
            // children: image alone, or link_open -> image -> link_close
            if (!token.children || (token.children.length !== 1 && token.children.length !== 3)) {
                continue;
            }
            // one child, should be img
            if (token.children.length === 1 && token.children[0].type !== 'image') {
                continue;
            }
            // three children, should be image enclosed in link
            if (
                token.children.length === 3 &&
                (token.children[0].type !== 'link_open' ||
                    token.children[1].type !== 'image' ||
                    token.children[2].type !== 'link_close')
            ) {
                continue;
            }
            // prev token is paragraph open
            if (i !== 0 && state.tokens[i - 1].type !== 'paragraph_open') {
                continue;
            }
            // next token is paragraph close
            if (i !== l - 1 && state.tokens[i + 1].type !== 'paragraph_close') {
                continue;
            }

            // We have inline token containing an image only.
            // Previous token is paragraph open.
            // Next token is paragraph close.
            // Lets replace the paragraph tokens with figure tokens.
            let figure = state.tokens[i - 1];
            figure.type = 'section_open';
            figure.tag = 'section';
            state.tokens[i + 1].type = 'section_close';
            state.tokens[i + 1].tag = 'section';
            state.tokens[i - 1].attrPush(['class', 'image-box']);
            let image;


            // for linked images, image is one off
            image = token.children.length === 1 ? token.children[0] : token.children[1];

            if (image.children && image.children.length) {
                const textToken = new state.Token('section_open', 'section', 1);
                textToken.attrPush(['class', 'image-text']);
                token.children.push(textToken);
                token.children.splice(token.children.length, 0, ...image.children);
                token.children.push(new state.Token('section_close', 'section', -1));
                image.children.length = 0;
            }


        }
    }
    md.core.ruler.before('linkify', 'implicit_figures', implicitFigures);
};
