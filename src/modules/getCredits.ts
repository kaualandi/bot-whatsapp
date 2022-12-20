import { Client, Message } from "@open-wa/wa-automate";
import { getClients } from "../service/query";

async function getCredits(client: Client, message: Message) {
  const { id, from, sender, isGroupMsg, chat } = message;

  if (isGroupMsg) return;

  let { pushname, verifiedName } = sender;
  pushname = pushname || verifiedName;

  await client.react(id, "👌");

  const allClients = await getClients();
  if (allClients.error)
    return client.reply(
      from,
      `Não consegui recuperar os clientes!\n${allClients.message.text}`,
      id
    );
  const isClient = allClients.find((client: any) => client.phone === chat.id);
  if (!isClient)
    return client.reply(
      from,
      "Você nem cadastro possui, quem dirá ter créditos. Solicite uma recarga.",
      id
    );
  const stringToSend = `*=== CRÉDITOS ===*\nVocê possui ${isClient.credits} creditos para consultas.\n\nVocê pode recarregar me chamando :)`;
  client.reply(from, stringToSend, id);
}

export default getCredits;