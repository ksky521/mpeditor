export default function (text) {
    return (text = text.replace(/<p>\s*\[center]((.+\n)+.*?)\[\/center]\s*<\/p>/gi, function (m, txt) {
        return `<section style="text-align:center;">${txt}</section>`;
    }));
}
