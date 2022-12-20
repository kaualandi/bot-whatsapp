import { Client, Message } from "@open-wa/wa-automate";
import { alterClient, getClients, pushByPhone } from "../service/query";

function formatDate(dateUsa: string) {
  const dateArr = dateUsa.split("-");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}

async function phoneQuery(client: Client, message: Message) {
  const { id, from, body, sender, isGroupMsg, chat, caption } = message;

  if (isGroupMsg) return;

  let { pushname, verifiedName } = sender;
  pushname = pushname || verifiedName;
  const commands = caption || body || "";
  const args = commands.split(" ");

  if (args.length === 1)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber o nome também!",
      id
    );

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
      "Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.",
      id
    );
  if (isClient.credits <= 0)
    return client.reply(
      from,
      "Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.",
      id
    );

  let number: any = "";
  if (args[1].includes("@")) {
    number = args[1].split("@55").join("");
  } else {
    number = args[1].match(/\d/g)?.join("");
  }
  if (number?.split("")[0] == "0") number = number.split("").slice(1).join("");

  if (number?.length === 10) {
    number = number.split("");
    number.splice(2, 0, 9);
    number = number.join("");
  }
  if (number.length !== 11)
    return client.reply(
      from,
      "Digite um número válido.\nEx: 21999888212 ou mencione alguém",
      id
    );

  const query = await pushByPhone(number);
  if (query.error)
    return client.reply(
      from,
      `Não consegui realizar a consulta!\n${query.message.text}`,
      id
    );

  const requestDownCredits = await alterClient(
    isClient.credits - 1,
    "credits",
    isClient.id
  );
  if (requestDownCredits.status === "error")
    return client.reply(
      from,
      `Não consegui reduzir seus creditos, portanto, não farei a consulta!\n${requestDownCredits.message.text}`,
      id
    );

  await client.react(id, "👌");

  const data = query;
  if (data.error)
    return client.reply(
      from,
      `Não consegui recuperar os dados do telefone: ${number}!\n${data.message}`,
      id
    );

  if (data?.header?.error) {
    return client.reply(from, data?.header?.error, id);
  }
  const results = data.result;

  let stringToSend = `*=== CONSULTA REALIZADA ===*`;
  results.forEach((result: any) => {
    const pessoa = result.pessoa.cadastral;
    const { CPF, nomePrimeiro, nomeMeio, nomeUltimo, dataNascimento } = pessoa;
    const nomeCompleto = `${nomePrimeiro || ""} ${nomeMeio || ""} ${
      nomeUltimo || ""
    }`;
    const stringPreparada = `${CPF ? "\nCPF: " + CPF : ""} ${
      nomeCompleto ? "\nNome: " + nomeCompleto : ""
    } ${
      dataNascimento
        ? "\nData de nascimento: " + formatDate(dataNascimento)
        : ""
    }\n`;
    stringToSend += stringPreparada;
  });
  stringToSend += `\nConsultado por: ${pushname}`;
  await client.reply(from, stringToSend, id);
}

export default phoneQuery;
