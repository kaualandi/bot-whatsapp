import { Client, Message } from "@open-wa/wa-automate";

async function myNumber(client: Client, message: Message) {
  const { id, from, sender } = message;

  let chatNumber = sender.id.split('-');
  let ddd = chatNumber[0].substring(2, 4);
  let number = chatNumber[0].substring(4, 13);

  await client.react(id, "👌");

  client.reply(from, `Seu numero é: *(${ddd}) ${number}*.\nSendo *${ddd}* seu DDD.`, id);
}

export default myNumber;