import { Client, Message } from "@open-wa/wa-automate";

async function adminList(client: Client, message: Message) {
  const { id, from, isGroupMsg, chat } = message;

  if (!isGroupMsg)
    return client.reply(from, "Este comando só funciona em grupos", id);

  await client.react(id, "👌");

  const groupId = chat.groupMetadata.id;
  const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : [];

  let textToSend = "*=== Lista de Admins ===*\n";
  for (let admin of groupAdmins) {
    textToSend += `→ @${admin.replace(/@c.us/g, "")}\n`;
  }
  await client.sendTextWithMentions(from, textToSend);
}

export default adminList;
