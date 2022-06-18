const axios = require('axios');

exports.cep = async function cep(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    const commands = caption || body || "";
    const args = commands.split(" ");

    if (args.length === 1) return client.reply(from, 'Ainda não adivinho coisas... preciso saber o cep também', id);

    let response = await axios.get(`https://viacep.com.br/ws/${args[1]}/json/`);
    const { logradouro, bairro, localidade, siafi, ibge } = response.data;

    await client.reply(from, 'Buscando o CEP... pera um pouco', id);
    await client.sendText(from, `🌎️ Rua: ${logradouro}, ${bairro}, ${localidade}\nSiafi: ${siafi}, Ibge: ${ibge} `);
}