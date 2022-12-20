import { Client, Message } from "@open-wa/wa-automate";
import {
  checkAuthorization,
  updateAuthorization,
} from "../service/authorization";

async function deleteAuthorization(client: Client, message: Message) {
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

    if (authorization !== false) {
      const _alterAuthorization = await updateAuthorization(false, chat.id);

      if (_alterAuthorization) {
        await client.sendText(
          from,
          "🔒 Autorização desativada!\nVocê poderá autorizar novamente a qualquer momento usando o comando *!autorizarbot*"
        );
      } else {
        await client.sendText(from, `🔓 Erro ao desautorizar autorização!`);
      }
    } else {
      await client.sendText(
        from,
        "🔒 A autorização já estava desativada!\nVocê pode autorizar usando o comando *!autorizarbot*"
      );
    }
  } else {
    if (!_checkAuthorization.status && _checkAuthorization.error === 404) {
      await client.sendText(
        from,
        "🔒 A autorização já estava desativada!\nVocê pode autorizar usando o comando *!autorizarbot*"
      );
    } else {
      await client.sendText(
        from,
        `🔓 Erro ao verificar autorização!\n${_checkAuthorization.error}`
      );
    }
  }
}

export default deleteAuthorization;
