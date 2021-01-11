import emojiMap from './emoji.json';

export default function (text) {
    return text.replace(/:([a-z0-9_+-]+):/g, (match, iconId) => {
        // https://assets-cdn.github.com/images/icons/emoji/octocat.png
        return emojiMap[iconId] ? emojiMap[iconId] : match;
    });
}
