import { Client, Message } from "@open-wa/wa-automate";
import axios from "axios";

async function getTemp(client: Client, message: Message) {
  const { id, from, body, caption } = message;

  const commands = caption || body || "";
  const args = commands.split(" ");

  const cidade = args.slice(1).join(" ");

  if (typeof cidade !== "undefined") {
    if (cidade.length == 0)
      return client.reply(
        from,
        "Ainda não adivinho coisas... preciso saber a cidade também",
        id
      );

    await client.react(id, "👌");

    let clima = await axios.get(
      `https://weather.contrateumdev.com.br/api/weather/city/?city=${encodeURI(
        cidade
      )}`
    );

    if (clima?.data?.cod == "404")
      return await client.reply(from, `Eita... ${clima?.data?.message}`, id);

    await client.sendText(
      from,
      `*Temperatura:* ${clima?.data?.main?.temp} ºC \n*Sensação térmica:* ${clima?.data?.main?.feels_like} ºC \n*Temperatura mínima:* ${clima?.data?.main?.temp_min} ºC \n*Temperatura máxima:* ${clima?.data?.main?.temp_max} ºC \n*Pressão atmosférica:* ${clima?.data?.main?.pressure}\n*Umidade:* ${clima?.data?.main?.humidity}%\n----------------------\n${clima?.data?.name} - lat: ${clima?.data?.coord?.lat} lon: ${clima?.data?.coord?.lon}`
    );
  } else {
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber a cidade também",
      id
    );
  }
}

export default getTemp;
