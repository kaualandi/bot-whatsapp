import { Client, Message } from "@open-wa/wa-automate";

async function leave(client: Client, message: Message) {
  const { id, from, sender, isGroupMsg, chat } = message;

  if (!isGroupMsg) {
      return client.reply(from, "Este comando só pode ser usado em grupos.", id);
  }

  const groupId = chat.groupMetadata.id;
  const groupAdmins = await client.getGroupAdmins(groupId);
  const isGroupAdmins = groupAdmins.includes(sender.id);

  if (!isGroupAdmins) {
      return client.reply(from, "Somente administradores do grupo podem usar este comando.", id);
  }

  await client.react(id, "👌");

  await client.sendText(from, 'Adeus!').then(() => client.leaveGroup(groupId));
}

export default leave;