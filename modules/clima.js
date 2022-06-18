const axios = require('axios');

exports.clima = async function clima(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    const commands = caption || body || "";
    const args = commands.split(" ");

    if (args.length === 1) return client.reply(from, 'Ainda não adivinho coisas... preciso saber a cidade também', id);

    const cidade = args.slice(1).join(" ");

    if (typeof cidade !== 'undefined') {
        if (cidade.length == 0) return client.reply(from, 'Preciso de uma cidade...', id);

        await client.reply(from, `Verificando com São Pedro como está o clima em ${cidade}... pera um pouco`, id);

        let clima = await axios.get(`https://weather.contrateumdev.com.br/api/weather/city/?city=${encodeURI(cidade)}`);

        if (clima?.data?.cod == '404') return await client.reply(from, `Uai... ${clima?.data?.message}`, id);

        await client.sendText(from, `*Temperatura:* ${clima?.data?.main?.temp} ºC \n*Sensação térmica:* ${clima?.data?.main?.feels_like} ºC \n*Temperatura mínima:* ${clima?.data?.main?.temp_min} ºC \n*Temperatura máxima:* ${clima?.data?.main?.temp_max} ºC \n*Pressão atmosférica:* ${clima?.data?.main?.pressure}\n*Umidade:* ${clima?.data?.main?.humidity}%\n----------------------\n${clima?.data?.name} - lat: ${clima?.data?.coord?.lat} lon: ${clima?.data?.coord?.lon}`);
    } else {
        return client.reply(from, 'Preciso de uma cidade...', id);
    }
}