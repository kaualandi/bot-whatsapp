exports.linkdogrupo = async function linkdogrupo(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;
    const { name } = chat;

    if (!isGroupMsg) return client.reply(from, "Este comando só funciona em grupos", id);

    const botNumber = await client.getHostNumber();
    const groupId = isGroupMsg ? chat.groupMetadata.id : '';
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false;

    if (!isBotGroupAdmins) return client.reply(from, "Preciso ser administrador do grupo para que isso funcione.", id);

    const inviteLink = await client.getGroupInviteLink(groupId);
    client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo: *${name}*`);

}