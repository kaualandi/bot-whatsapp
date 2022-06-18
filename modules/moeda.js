const axios = require('axios');

exports.moeda = async function moeda(client, message) {
    const { id, from, sender, isGroupMsg, chat, body, caption, isMedia, mimetype, quotedMsg, quotedMsgObj } = message;
    const commands = caption || body || "";
    const args = commands.split(" ");
    
    if (args.length === 1) return client.reply(from, 'Ainda não adivinho coisas... preciso saber as moedas também!\nUse *!moeda BTCxBRL*', id);

    let moeda = args[1];
    parametroBusca = moeda.split('x');

    if (parametroBusca.length === 1) return client.reply(from, 'Use *!moeda BTCxBRL*', id);

    try {
        let coinmarketcap = await axios({
            method: 'GET',
            url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${parametroBusca[0]}&convert=${parametroBusca[1]}`,
            headers: { 'Content-Type': 'application/json', 'X-CMC_PRO_API_KEY': 'b2776f73-fbda-4b91-8d8b-221be52eb5ff' },
        });

        let coinmarketcapData = coinmarketcap?.data?.data;

        let textoSend = `*Nome:* ${coinmarketcapData[parametroBusca[0]].name}\n*Ranking:* ${coinmarketcapData[parametroBusca[0]].cmc_rank != null ? coinmarketcapData[parametroBusca[0]].cmc_rank : 'Sem posição'
            }\n*Sigla:* ${coinmarketcapData[parametroBusca[0]].symbol}\n*Preço:* ${parseFloat(
                coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]].price
            ).toLocaleString('pt-br', { style: 'currency', currency: `${parametroBusca[1]}` })}\n*Volume 24h:* ${parseFloat(
                coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]].volume_24h
            ).toLocaleString('pt-br', { style: 'currency', currency: `${parametroBusca[1]}` })}\n*Suprimento máximo:* ${coinmarketcapData[parametroBusca[0]].max_supply != null
                ? parseFloat(coinmarketcapData[parametroBusca[0]].max_supply).toLocaleString('pt-br', {
                    style: 'currency',
                    currency: `${parametroBusca[1]}`,
                })
                : 'R$ 0,00'
            }\n*Suprimento circulante:* ${parseFloat(coinmarketcapData[parametroBusca[0]].circulating_supply).toLocaleString('pt-br', {
                style: 'currency',
                currency: `${parametroBusca[1]}`,
            })}\n*Suprimento total:* ${parseFloat(coinmarketcapData[parametroBusca[0]].total_supply).toLocaleString('pt-br', {
                style: 'currency',
                currency: `${parametroBusca[1]}`,
            })}\n*Atualização:* ${coinmarketcapData[parametroBusca[0]].quote[parametroBusca[1]]?.last_updated}\n`;

        await client.reply(from, `${textoSend}`, id);
    } catch (error) {
        console.error(error);
        await client.reply(from, `Não achei essa moeda... *${parametroBusca[0]}*, cuidado ao investir!`, id);
    }

}