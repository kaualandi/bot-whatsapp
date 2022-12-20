import { Client, Message } from "@open-wa/wa-automate";

async function readme(client: Client, message: Message) {
  const { id, from } = message;

  await client.react(id, "👌");

  const readme = `*=== README do BOT! ===*\nSou o Bruce um bot para whatsapp de código aberto construído pelo Kauã.\n\nQuer ver como fui feito ou ter-me em seu número?\nAcessa o repo ai. Aproveita e dá aquela ⭐!\nhttps://github.com/kaualandi/bot-whatsapp.`;

  await client.reply(from, readme, id);
}

export default readme;
