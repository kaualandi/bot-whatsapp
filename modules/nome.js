const { getClients, alterClient, pushByName } = require("../fetch");
require("dotenv").config();

function formatDate(dateUsa) {
    const dateArr = dateUsa.split("-");
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}

exports.nome = async function nome(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    if (isGroupMsg) return

    let { pushname, verifiedName } = sender;
    pushname = pushname || verifiedName;
    const commands = caption || body || "";
    const args = commands.split(" ");
    const name = args.slice(1).join(" ");

    if (args.length === 1) return client.reply(from, 'Ainda não adivinho coisas... preciso saber o nome também!', id);

    const allClients = await getClients();
    if (allClients.error) return client.reply(from, `Não consegui recuperar os clientes!\n${allClients.message.text}`, id);

    const isClient = allClients.find(client => client.phone === chat.id);
    if (!isClient) return client.reply(from, 'Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.', id);
    if (isClient.credits <= 0) return client.reply(from, 'Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.', id);

    const query = await pushByName(name);
    if (query.error) return client.reply(from, `Não consegui realizar a consulta!\n${query.message.text}`, id);

    const requestDownCredits = await alterClient(isClient.credits - 1, 'credits', isClient.id)
    if (requestDownCredits.error) return client.reply(from, `Não consegui reduzir seus creditos, portanto, não farei a consulta!\n${requestDownCredits.message.text}`, id);

    const data = query;
    if (data.error) return client.reply(from, `Não consegui recuperar os dados do nome: ${name}!\n${data.message.text}`, id);

    if (data.header.error !== null) {
        return client.reply(from, data.header.error, id);
    }
    const results = data.result;

    let stringToSend = `*=== CONSULTA REALIZADA ===*`;
    results.forEach(result => {
        const pessoa = result.pessoa.cadastral;
        const { CPF, nomePrimeiro, nomeMeio, nomeUltimo, dataNascimento } = pessoa;
        const nomeCompleto = `${nomePrimeiro || ''} ${nomeMeio || ''} ${nomeUltimo || ''}`;
        const stringPreparada = `${CPF ? '\nCPF: ' + CPF : ''} ${nomeCompleto ? '\nNome: ' + nomeCompleto : ''} ${dataNascimento ? '\nData de nascimento: ' + formatDate(dataNascimento) : ''}\n`;
        stringToSend += stringPreparada;
    });
    stringToSend += `\nConsultado por: ${pushname}`;
    client.reply(from, stringToSend, id);
}