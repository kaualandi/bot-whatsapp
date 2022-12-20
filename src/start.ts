import { Client, Message } from "@open-wa/wa-automate";
import commands from "./commands";
import { authorization } from "./service/authorization";

const allMessages = {
  imNotAuthorized: () =>
    `*Não tenho autorização de funcionar aqui.*\nPeça para que um admin execute o comando *!autorizarbot*`,
};

async function start(client: Client, message: Message) {
  const { id, caption, body, isGroupMsg, chat, from } = message;
  const text = caption || body || "";
  let command = text.toLowerCase().split(" ")[0].split(" ")[0].split("\n")[0];
  const isCommand = text.startsWith("!") || text.startsWith(".");

  let commandText = "";

  if (isCommand) {
    commandText = command.split("").slice(1).join("");
  }

  if (isCommand && commands[commandText]) {
    if (isGroupMsg) {
      if (!(await authorization(chat.id))) {
        if (command !== "!autorizarbot" && command !== ".autorizarbot") {
          console.log("\x1b[1;31mNOT AUTHORIZED! IGNORING\x1b[0m");
          return client.reply(from, allMessages.imNotAuthorized(), id);
        } else {
          try {
            await commands[commandText](client, message);
          } catch (error) {
            console.log("ERROR IN MODULE:", error);
          }
        }
      } else {
        try {
          await commands[commandText](client, message);
        } catch (error) {
          console.log("ERROR IN MODULE:", error);
        }
      }
    } else {
      try {
        await commands[commandText](client, message);
      } catch (error) {
        console.log("ERROR IN MODULE:", error);
      }
    }
  } else {
    console.log("Comando inexistente");
    console.log("UNKNOWN COMMAND:", command);
  }
}

export default start;
