exports.adminlista = async function adminlista(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (!isGroupMsg) return client.reply(from, "Este comando só funciona em grupos", id);

    const groupId = isGroupMsg ? chat.groupMetadata.id : '';
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';

    let mimin = '*=== Lista de Admins ===*\n';
    for (let admon of groupAdmins) {
        mimin += `→ @${admon.replace(/@c.us/g, '')}\n`;
    }
    await client.sendTextWithMentions(from, mimin);

}