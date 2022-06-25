exports.avisartodos = async function avisartodos(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj } = message;

    if (!isGroupMsg) {
        return client.reply(from, "Este comando só pode ser usado em grupos.", id);
    }

    const groupId = chat.groupMetadata.id;
    const groupAdmins = await client.getGroupAdmins(groupId);
    const isGroupAdmins = groupAdmins.includes(sender.id);

    if (!isGroupAdmins) {
        return client.reply(from, "Somente administradores do grupo podem usar este comando.", id);
    }

    let { pushname, verifiedName } = sender;
    pushname = pushname || verifiedName;
    const commands = caption || body || "";
    const args = commands.split(" ");
    let alertToSend;

    if (quotedMsg) {
        alertToSend = quotedMsgObj.text;
    } else {
        if (args.length !== 1) {
            alertToSend = args.slice(1).join(" ");
        } else if (commands.split('\n').length !== 1) {
            const args = commands.split('\n');
            alertToSend = args.slice(1).join("\n");
        } else {
            return client.reply(from, 'Ainda não adivinho coisas... preciso saber a mensagem!', id);
        }
    }

    const groupMem = await client.getGroupMembers(groupId);
    let allUsersMention = '';
    for (let i = 0; i < groupMem.length; i++) {
        allUsersMention += `@${groupMem[i].id.replace(/@c.us/g, '')} `;
    }

    const textToSend = `*=== Aviso Geral ===*\n${alertToSend}\n\n${allUsersMention}`;

    await client.sendTextWithMentions(from, textToSend);
}