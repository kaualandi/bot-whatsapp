import { Client, Message } from "@open-wa/wa-automate";
import googleTTS from "google-tts-api";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
const urlParse = require("url").parse;

async function downloadFile(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    const info = urlParse(url);
    const httpClient = info.protocol === "https:" ? https : http;
    const options = {
      host: info.host,
      path: info.path,
      headers: {
        "user-agent": "WHAT_EVER",
      },
    };

    httpClient
      .get(options, (res) => {
        // check status code
        if (res.statusCode !== 200) {
          const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
          reject(new Error(msg));
          return;
        }
        const file = fs.createWriteStream(dest);
        file.on("finish", function () {
          // close() is async, call resolve after close completes.
          file.close(resolve);
        });
        file.on("error", function (err) {
          // Delete the file async. (But we don't check the result)
          fs.unlink(dest, () => {});
          reject(err);
        });
        res.pipe(file);
      })
      .on("error", reject)
      .end();
  });
}

async function textToSpeech(client: Client, message: Message) {
  const { id, from, body, caption } = message;

  const commands = caption || body || "";
  const args = commands.split(" ");

  if (args.length === 1)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber de uma frase também!",
      id
    );
  let string = commands.split(" ").slice(1).join(" ");
  if (string.length >= 200) {
    return client.reply(
      from,
      `Porra bisho q treco grande, quer me bugar??`,
      id
    );
  }

  await client.react(id, "👌");

  const url = googleTTS.getAudioUrl(`${string}`, {
    lang: "pt_BR",
    slow: false,
    host: "https://translate.google.com",
  });

  const dest = await path.resolve(__dirname, "../media/translate.mp3");
  await downloadFile(url, dest);
  await client.sendPtt(from, dest, id);
}

export default textToSpeech;
