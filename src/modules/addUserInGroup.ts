import { Client, ContactId, GroupChatId, Message } from "@open-wa/wa-automate";

async function addUserInGroup(client: Client, message: Message) {
  const { id, from, sender, isGroupMsg, chat, body, caption } = message;

  if (!isGroupMsg) {
    return client.reply(from, "Este comando só pode ser usado em grupos.", id);
  }

  const commands = caption || body || "";
  const args = commands.split(" ");

  if (args.length === 1)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber quem também!",
      id
    );

  const groupId = chat.groupMetadata.id;
  const groupAdmins = await client.getGroupAdmins(groupId);
  const isGroupAdmins = groupAdmins.includes(sender.id);
  const botNumber = await client.getHostNumber();
  const isBotGroupAdmins = isGroupMsg
    ? groupAdmins.includes((botNumber + "@c.us") as ContactId)
    : false;

  if (!isGroupAdmins) {
    return client.reply(
      from,
      "Somente administradores do grupo podem usar este comando.",
      id
    );
  }

  if (!isBotGroupAdmins)
    return client.reply(
      from,
      "Preciso ser administrador do grupo para que isso funcione.",
      id
    );

  let number;
  if (args[1].includes("@")) {
    number = args[1].split("@55").join("");
  } else {
    number = (args[1].match(/\d/g) || []).join("");
  }
  if (number.split("")[0] == "0") number = number.split("").slice(1).join("");

  if (number.length === 10) {
    number = number.split("");
    number.splice(2, 0, "9");
    number = number.join("");
  }
  if (number.length !== 11)
    return client.reply(from, "Digite um número válido.\nEx: 21999888212", id);

  await client.react(id, "👌");
  try {
    await client.addParticipant(
      from as GroupChatId,
      `55${number}@c.us` as ContactId
    );
  } catch (error) {
    await client.reply(
      from,
      `Deu merda, não consegui adiciona-lo.\n${error}`,
      id
    );
  }
}

export default addUserInGroup;
