import { Client, Message } from "@open-wa/wa-automate";
import { createInfor, getInfor, updateInfor } from "../service/infor";

async function setInfo(client: Client, message: Message) {
  const { id, from, body, chat, isGroupMsg, sender } = message;

  if (!isGroupMsg) {
    client.sendText(from, "Este comando só pode ser usado em grupos!");
    return;
  }

  const chatId = chat.groupMetadata.id;
  const groupAdmins = await client.getGroupAdmins(chatId);
  const isGroupAdmins = groupAdmins.includes(sender.id);

  if (!isGroupAdmins) {
      return client.reply(from, "Somente administradores do grupo podem usar este comando.", id);
  }

  const texts = body.split(" ");
  texts.shift();
  const text = texts.join(" ");

  if (!text) {
    client.sendText(from, "Eu ainda não adivinho coisas. Você precisa enviar o texto que deseja usar como informação do grupo.\nDeve conter pelo menos uma palavra após o comando antes de qualquer quebra de linha.");
    return;
  }
  
  const _getInfor = await getInfor(chatId);
  if (_getInfor.status) {
    const setInfor = await updateInfor(chatId, text);
    if (setInfor) {
      client.sendText(from, "Informação do grupo atualizada com sucesso!");
    } else {
      client.sendText(from, "Não foi possível atualizar a informação do grupo.");
    }
  } else {
    const setInfor = await createInfor(chatId, text);
    if (setInfor) {
      client.sendText(from, "Informação do grupo criada com sucesso!\n\nEla será disparada com o comando *!info* ou quando algum usuário entrar no grupo.");
    } else {
      client.sendText(from, "Não foi possível criar a informação do grupo.");
    }
  }
}

export default setInfo;