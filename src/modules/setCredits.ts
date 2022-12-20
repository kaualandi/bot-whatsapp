import { Client, Message } from "@open-wa/wa-automate";
import { addClient, getClients, alterClient} from "../service/query";

async function setCredits(client: Client, message: Message) {
  const { id, from, body, caption } = message;

  const commands = caption || body || "";
  const args = commands.split(" ");

  if (from !== '5521999222644@c.us') {
    return client.reply(
      from,
      "Você não tem permissão para executar esse comando!",
      id
    );
  }

  if (args.length < 3)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber o número e a quantidade de créditos também",
      id
    );

  const phone = args[1];
  const credits = parseInt(args[2]) || 0;

  await client.react(id, "👌");

  const clients = await getClients();
  if (clients.status === "error") {
    return client.reply(
      from,
      `Não consegui recuperar os clientes!\n${clients.message.text}`,
      id
    );
  }

  const _client = clients.find((client: any) => client.phone === `${phone}@c.us`);

  if (!_client) {
    const response = await addClient(credits, `${phone}@c.us`);

    if (response.status === "error") {
      return client.reply(
        from,
        `Não consegui criar o cliente!\n${response.message.text}`,
        id
      );
    } else {
      return client.reply(
        from,
        `Agora ${phone} tem ${credits} creditos!`,
        id
      );
    }
  } else {
    const response = await alterClient(credits, "credits", _client.id);

    if (response.status === "error") {
      return client.reply(
        from,
        `Não consegui editar o cliente!\n${response.message.text}`,
        id
      );
    } else {
      return client.reply(
        from,
        `Agora ${phone} tem ${credits} creditos!`,
        id
      );
    }
  }
}

export default setCredits;
