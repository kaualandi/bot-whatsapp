exports.apagar = async function apagar(client, message) {
    const { id, from, sender, isGroupMsg, chat, body, caption, isMedia, mimetype, quotedMsg, quotedMsgObj } = message;


    if (!quotedMsg) return client.reply(from, 'Ainda não adivinho coisas... Mencione uma mensagem minha', id);

    const commands = caption || body || "";
    const args = commands.split(" ");

    const botNumber = await client.getHostNumber();
    const blockNumber = await client.getBlockedIds();
    const groupId = isGroupMsg ? chat.groupMetadata.id : '';
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';
    const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false;

    if (isGroupMsg && !isGroupAdmins) {
        return client.reply(from, "Somente administradores do grupo podem usar este comando.", id);
    }

    if (!quotedMsgObj.fromMe) return client.reply(from, 'Eu não consigo deletar a mensagem de outro usuário!', id);


    await client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false);
    await client.reply(from, `Pronto! apaguei a mensagem.`, id);

}
