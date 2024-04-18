import { Client, Message } from "@open-wa/wa-automate";
import { decryptMedia } from "@open-wa/wa-decrypt";

async function sticker(client: Client, message: Message) {
  const { id, from, isMedia, mimetype, type, quotedMsg, sender } = message;
  let { pushname, verifiedName } = sender;
  pushname = pushname || verifiedName;

  const pack = `Feito por ${pushname}`;

  const uaOverride =
    "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

  if (isMedia && type === "image") {
    const mediaData = await decryptMedia(message, uaOverride);
    const imageBase64 = `data:${mimetype};base64,${mediaData.toString(
      "base64"
    )}`;
    await client.react(id, "👌");
    await client.sendImageAsSticker(from, imageBase64, {
      author: "faça em: (21) 99922-2644",
      pack,
      keepScale: true,
    });
  } else if (quotedMsg && quotedMsg.type == "image") {
    const mediaData = await decryptMedia(quotedMsg, uaOverride);
    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString(
      "base64"
    )}`;
    await client.react(id, "👌");
    await client.sendImageAsSticker(from, imageBase64, {
      author: "faça em: (21) 99922-2644",
      pack,
      keepScale: true,
    });
  } else if (
    (mimetype === "video/mp4" && (Number(message.duration) || 31) < 30) ||
    (mimetype === "image/gif" && (Number(message.duration) || 31) < 30)
  ) {
    const mediaData = await decryptMedia(message, uaOverride);
    await client.react(id, "👌");
    await client.sendMp4AsSticker(
      from,
      `data:${mimetype};base64,${mediaData.toString("base64")}`,
      undefined,
      {
        author: "faça em: (21) 99922-2644",
        pack,
      }
    );
  } else if (
    (quotedMsg?.mimetype === "video/mp4" &&
      (Number(quotedMsg?.duration) || 31) < 30) ||
    (quotedMsg?.mimetype === "image/gif" &&
      (Number(quotedMsg?.duration) || 0) < 30)
  ) {
    const mediaData = await decryptMedia(quotedMsg, uaOverride);
    await client.react(id, "👌");
    await client.sendMp4AsSticker(
      from,
      `data:${quotedMsg.mimetype};base64,${mediaData.toString("base64")}`,
      undefined,
      {
        author: "faça em: (21) 99922-2644",
        pack,
      }
    );
  } else {
    client.reply(
      from,
      "Eu preciso receber alguma foto ou vídeo, seja ela por menção ou *!s* na legenda.",
      id
    );
  }
}

export default sticker;
