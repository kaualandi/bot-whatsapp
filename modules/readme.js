exports.readme = async function readme(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    const readme = `*=== README do BOT! ===*\nSou o Bruce um bot para whatsapp de código aberto construído pelo Kauã.\n\nQuer ver como fui feito ou ter-me em seu número?\nAcessa o repo ai. Aproveita e dá aquela ⭐!\nhttps://github.com/kaualandi/bot-whatsapp.`;

    await client.reply(from, readme, id);
}