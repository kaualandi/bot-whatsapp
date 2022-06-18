exports.meunumero = async function meunumero(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    let chatNumber = sender.id.split('-');
    let ddd = chatNumber[0].substring(2, 4);
    let number = chatNumber[0].substring(4, 13);

    client.reply(from, `Seu numero é: *${number}* seu ddd é: *${ddd}*`, id);
}