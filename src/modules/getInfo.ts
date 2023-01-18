import { Client, Message } from "@open-wa/wa-automate";
import { getInfor } from "../service/infor";

async function getInfo(client: Client, message: Message) {
  const { id, from, body, caption, chat, isGroupMsg } = message;

  if (!isGroupMsg) {
    client.sendText(from, "Este comando só pode ser usado em grupos!");
    return;
  }

  const chatId = chat.groupMetadata.id;

  const _getInfor = await getInfor(chatId);
  if (_getInfor.status) {
    const infor = _getInfor.infor;
    if (infor?.text) {
      client.sendText(from, infor?.text);
    }
  } else {
    client.sendText(from, "Não há informações sobre este grupo!");
  }
}

export default getInfo;