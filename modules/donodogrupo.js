exports.donodogrupo = async function donodogrupo(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (!isGroupMsg) return client.reply(from, "Este comando só funciona em grupos", id);

    const Owner_ = chat.groupMetadata.owner;
    await client.sendTextWithMentions(from, `Dono do grupo: @${Owner_}`);
}