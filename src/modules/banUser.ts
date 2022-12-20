import { ChatId, Client, ContactId, Message } from "@open-wa/wa-automate";

async function banUser(client: Client, message: Message) {
  const {
    id,
    from,
    sender,
    isGroupMsg,
    chat,
    quotedMsg,
    mentionedJidList,
  } = message;

  if (!isGroupMsg) {
    return client.reply(from, "Este comando só pode ser usado em grupos.", id);
  }
  const { formattedTitle } = chat;
  const ownerNumber = "5521999222644@c.us";

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

  const groupOwner = chat.groupMetadata.owner as unknown as string;

  await client.react(id, "👌");

  if (quotedMsg) {
    const banUser = quotedMsg.author;
    if (banUser == sender.id)
      return client.reply(from, "Banindo a si mesmo? Ta loko?!", id);
    if (banUser == (groupOwner as unknown as string))
      return client.reply(from, "Você não pode banir o dono do grupo", id);
    if (mentionedJidList.includes(ownerNumber))
      return client.reply(
        from,
        "Sabe algo que não vou fazer? Banir a mim mesmo!\n\nCaso não me queira mais aqui, use o comando *!sair*\nOu só me desative usando *!desautorizarbot*",
        id
      );
    await client.removeParticipant(groupId, banUser as ContactId);
  } else {
    if (mentionedJidList.length === 0)
      return client.reply(
        from,
        "Ainda não adivinho coisas... preciso saber quem também!\nEnvie o comando *!ban* @tagmember",
        id
      );
    if (mentionedJidList.includes(groupOwner as ContactId))
      return client.reply(from, "Você não pode banir o dono do grupo", id);
    if (mentionedJidList.includes(ownerNumber))
      return client.reply(
        from,
        "Sabe algo que não vou fazer? Banir a mim mesmo!\n\nCaso não me queira mais aqui, use o comando *!sair*\nOu só me desative usando *!desautorizarbot*",
        id
      );
    for (let i = 0; i < mentionedJidList.length; i++) {
      console.log("BANIDO ===>", mentionedJidList[i].replace(/@c.us/g, ""));
      await client.removeParticipant(groupId, mentionedJidList[i]);
    }
  }
}

export default banUser;
