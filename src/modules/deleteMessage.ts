import { Client, ContactId, Message } from "@open-wa/wa-automate";

async function deleteMessage(client: Client, message: Message) {
  const {
    id,
    from,
    sender,
    isGroupMsg,
    chat,
    body,
    caption,
    isMedia,
    mimetype,
    quotedMsg,
    quotedMsgObj,
  } = message;

  if (!quotedMsg)
    return client.reply(
      from,
      "Ainda não adivinho coisas... Mencione uma mensagem minha",
      id
    );

  const commands = caption || body || "";
  const args = commands.split(" ");

  const botNumber = await client.getHostNumber();
  const groupId = chat.groupMetadata.id;
  const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : [];
  const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
  const isBotGroupAdmins = isGroupMsg
    ? groupAdmins.includes((botNumber + "@c.us") as ContactId)
    : false;

  if (isGroupMsg && !isGroupAdmins) {
    return client.reply(
      from,
      "Somente administradores do grupo podem usar este comando.",
      id
    );
  }

  if (!quotedMsgObj?.fromMe && !isBotGroupAdmins)
    return client.reply(
      from,
      "Preciso ser admin para deletar a mensagem de outro usuário!",
      id
    );

  await client.react(id, "👌");

  await client.deleteMessage(quotedMsgObj!.chatId, quotedMsgObj!.id, false);
}

export default deleteMessage;
