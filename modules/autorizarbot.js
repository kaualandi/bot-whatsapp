const { alterAuthorization, checkAuthorization, createAuthorization } = require("../fetch");

exports.autorizarbot = async function autorizarbot(client, message) {
    const { id, from, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (!isGroupMsg) {
        return client.reply(from, "Este comando só pode ser usado em grupos.", id);
    }

    const groupId = chat.groupMetadata.id;
    const groupAdmins = await client.getGroupAdmins(groupId);
    const isGroupAdmins = groupAdmins.includes(sender.id);

    if (!isGroupAdmins) {
        return client.reply(from, "Somente administradores do grupo podem usar este comando.", id);
    }

    const _checkAuthorization = await checkAuthorization(chat.id);

    if (_checkAuthorization.status === "success") {
        const authorization = _checkAuthorization.authorization;

        if (authorization !== true) {
            const _alterAuthorization = await alterAuthorization(true, chat.id);

            if (_alterAuthorization.status === "success") {
                await client.sendText(from, "🔓 Autorização ativada!\nExperimente o comando !menu para ver todos os comandos.");
            } else {
                await client.sendText(from, `🔒 Erro ao ativar autorização!\n${_alterAuthorization.message.text}`);
            }
        } else {
            await client.sendText(from, "🔓 A autorização já estava ativada!\nVocê pode revogar a autorização usando o comando *!desautorizarbot*");
        }
    } else {
        if (_checkAuthorization.status === "error" && _checkAuthorization.message.code === 404) {
            const _createAuthorization = await createAuthorization(true, chat.id);

            if (_createAuthorization.status === "success") {
                await client.sendText(from, "🔓 Autorização ativada!\nExperimente o comando !menu para ver todos os comandos.");
            } else {
                await client.sendText(from, `🔒 Erro ao criar uma autorização!\n${_createAuthorization.message.text}`);
            }
        } else {
            await client.sendText(from, `🔒 Erro ao verificar autorização!\n${_checkAuthorization.message.text}`);
        }
    }
}