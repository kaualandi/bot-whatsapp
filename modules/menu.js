exports.menu = async function menu(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    const commands = caption || body || "";
    const args = commands.split(" ");

    const helpMode = args[1];
    const showAll = `*Ver tudo?*\nManda um _!menu_`;

    let help;

    switch (helpMode) {
        case 'figurinhas':
        case 'figurinha':
            help = `*=== Figurinhas do BOT! ===*\nMande uma foto, gif ou vídeo e digite _!s_ na legenda.\nVocê também pode mencionar a foto, gif ou vídeo respondendo _!s_.\n\n${showAll}`;
            break;
        case 'outros':
        case 'outro':
            help = `*=== Outros comandos do BOT! ===*\n→ !cep cep\n→ !clima sua cidade\n→ !tts isso converte texto em audio\n→ !meunumero\n→ !moeda BTCxBRL\n\n${showAll}`;
            break;
        case 'grupos':
        case 'grupo':
            help = `*=== Comandos para grupos ===*\n→ !adminlista\n→ !donodogrupo\n→ !mencionartodos\n→ !ban @usuário\n→ !add 2199988....\n→ !sair (eu saio do grupo)\n→ !autorizarbot (permite que o bot funciona)\n→ !desautorizarbot (proíba que o bot funciona)\n→ !promover\n→ !rebaixar\n→ !linkdogrupo\n→ !kickme\n\n${showAll}`;
            break;
        case 'consultas':
        case 'consulta':
            help = `*=== Consultas do BOT! ===*\nEsse recurso é pago.\nCusta R$ 0,50 por consulta\nCom recarga mínima de R$ 10,00\n→ !cpf 12312312312\n→ !nome nome completo\n→ !telefone 11999887744\n\nPara consultar seus creditos use:\n→ !creditos\n\n${showAll}`;
            break;
        case 'snaptubes':
        case 'snaptube':
            help = `*=== SnapTube BOT! ===*\n→ !yt (sua busca)\n\nPode buscar do mesmo jeito que vc escreve no youtube,\npois é de lá que tiro as músicas.\n\n${showAll}`;
            break;
        default:
            help = `*=== Menu do BOT! ===*\nOpa! Eu faço muitas coisas.\nescolha uma das categorias:\n*# Figurinhas* 📄\nManda _!menu figurinhas_\n*# Outros comandos* 📚\nManda _!menu outros_\n*# Para grupos* 📚\nManda _!menu grupos_\n*# Consultas* 👨‍💻\nManda _!menu consultas_\n*# Snaptube* 📺\nManda _!menu snaptube_\n----------------------\n╿\n╰╼ Sou Bruce, o bot do Kauã! `;
            break;
    }

    await client.reply(from, help, id);
}