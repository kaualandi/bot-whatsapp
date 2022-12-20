import { Client, Message } from "@open-wa/wa-automate";
import axios from "axios";

async function getCep(client: Client, message: Message) {
  const {
    id,
    from,
    body,
    caption,
  } = message;

  const commands = caption || body || "";
  const args = commands.split(" ");

  if (args.length === 1)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber o cep também",
      id
    );
  const cep = args[1].replace(/[^0-9]/g, "");

  if (cep.length !== 8)
    return client.reply(
      from,
      "O cep deve conter 8 digitos. Pode mandar com ou sem o traço.",
      id
    );

  await client.react(id, "👌");

  let response = await axios.get(`https://viacep.com.br/ws/${args[1]}/json/`);

  if (response.data.erro)
    return client.reply(from, "O CEP informado não existe", id);

  const { logradouro, bairro, localidade, siafi, ibge } = response.data;

  await client.sendText(
    from,
    `🌎️ Rua: ${logradouro || "-"}, ${bairro || "-"}, ${
      localidade || "-"
    }\nSiafi: ${siafi || "-"}, Ibge: ${ibge || "-"} `
  );
}

export default getCep;
