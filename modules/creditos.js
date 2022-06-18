const { getClients, alterClient, pushByPhone } = require("../fetch");
require("dotenv").config();

exports.creditos = async function creditos(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (isGroupMsg) return

    let { pushname, verifiedName } = sender;
    pushname = pushname || verifiedName;
    const commands = caption || body || "";
    const args = commands.split(" ");

    const allClients = await getClients();
    if (allClients.error) return client.reply(from, `Não consegui recuperar os clientes!\n${allClients.message.text}`, id);
    const isClient = allClients.find(client => client.phone === chat.id);
    if (!isClient) return client.reply(from, 'Você nem cadastro possui, quem dirá ter créditos. Solicite uma recarga.', id);
    const stringToSend = `*=== CRÉDITOS ===*\nVocê possui ${isClient.credits} creditos para consultas.\n\nVocê pode recarregar me chamando :)`;
    client.reply(from, stringToSend, id);
}