const { decryptMedia } = require('@open-wa/wa-decrypt');

exports.s = async function s(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype , type, quotedMsg } = message;

    const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';

    if (isMedia && type === 'image') {
        const mediaData = await decryptMedia(message, uaOverride);
        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`;
        await client.sendImageAsSticker(from, imageBase64, { author: 'faça em: (21)99922-2644', pack: 'Bot do Kauã Landi', keepScale: true });
    } else if (quotedMsg && quotedMsg.type == 'image') {
        const mediaData = await decryptMedia(quotedMsg, uaOverride);
        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
        await client.sendImageAsSticker(from, imageBase64, { author: 'faça em: (21)99922-2644', pack: 'Bot do Kauã Landi', keepScale: true });
    } else if ((mimetype === 'video/mp4' && message.duration < 30) || (mimetype === 'image/gif' && message.duration < 30)) {
        const mediaData = await decryptMedia(message, uaOverride);
        client.reply(from, 'Tô fazendo a figurinha...', id);
        await client.sendMp4AsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, null, {
            stickerMetadata: true,
            author: 'faça em: (21)99922-2644',
            pack: 'Bot do Kauã Landi',
            fps: 10,
            square: '512',
            loop: 0,
        });
    } else if ((quotedMsg.mimetype === 'video/mp4' && quotedMsg.duration < 30) || (quotedMsg.mimetype === 'image/gif' && quotedMsg.duration < 30)) {
        const mediaData = await decryptMedia(quotedMsg, uaOverride);
        await client.sendMp4AsSticker(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, null, {
            stickerMetadata: true,
            author: 'faça em: (21)99922-2644',
            pack: 'Bot do Kauã Landi',
            fps: 10,
            square: '512',
            loop: 0,
        })
    } else {
        client.reply(from, "Eu preciso receber alguma foto ou vídeo, seja ela por menção ou *!s* na legenda.", id);
    }
}