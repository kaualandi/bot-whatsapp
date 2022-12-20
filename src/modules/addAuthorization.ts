import { Client, Message } from "@open-wa/wa-automate";
import {
  checkAuthorization,
  createAuthorization,
  updateAuthorization,
} from "../service/authorization";

async function addAuthorization(client: Client, message: Message) {
  const {
    id,
    from,
    sender,
    isGroupMsg,
    chat,
    caption,
    isMedia,
    mimetype,
    quotedMsg,
  } = message;

  if (!isGroupMsg) {
    return client.reply(from, "Este comando só pode ser usado em grupos.", id);
  }

  const groupId = chat.groupMetadata.id;
  const groupAdmins = await client.getGroupAdmins(groupId);
  const isGroupAdmins = groupAdmins.includes(sender.id);

  if (!isGroupAdmins) {
    return client.reply(
      from,
      "Somente administradores do grupo podem usar este comando.",
      id
    );
  }

  const _checkAuthorization = await checkAuthorization(chat.id);

  if (_checkAuthorization.status) {
    const authorization = _checkAuthorization.authorization;

    if (authorization !== true) {
      const _alterAuthorization = await updateAuthorization(true, chat.id);

      if (_alterAuthorization) {
        await client.sendText(
          from,
          "🔓 Autorização ativada!\nExperimente o comando !menu para ver todos os comandos."
        );
      } else {
        await client.sendText(from, `🔒 Erro ao ativar autorização!`);
      }
    } else {
      await client.sendText(
        from,
        "🔓 A autorização já estava ativada!\nVocê pode revogar a autorização usando o comando *!desautorizarbot*"
      );
    }
  } else {
    if (!_checkAuthorization.status && _checkAuthorization.error === 404) {
      const _createAuthorization = await createAuthorization(true, chat.id);

      if (_createAuthorization.status) {
        await client.sendText(
          from,
          "🔓 Autorização ativada!\nExperimente o comando !menu para ver todos os comandos."
        );
      } else {
        await client.sendText(
          from,
          `🔒 Erro ao criar uma autorização!\n${_createAuthorization.error}`
        );
      }
    } else {
      await client.sendText(
        from,
        `🔒 Erro ao verificar autorização!\n${_checkAuthorization.error}`
      );
    }
  }
}

export default addAuthorization;
