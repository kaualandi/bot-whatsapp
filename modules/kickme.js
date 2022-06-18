exports.kickme = async function kickme(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (!isGroupMsg) return client.reply(from, "Este comando só funciona em grupos", id);

    const botNumber = await client.getHostNumber();
    const groupId = isGroupMsg ? chat.groupMetadata.id : '';
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false;

    if (!isBotGroupAdmins) return client.reply(from, "Preciso ser administrador do grupo para que isso funcione.", id);

    await client.reply(from, 'Agooora! kkkk', id);

    await client.removeParticipant(groupId, sender.id);
}