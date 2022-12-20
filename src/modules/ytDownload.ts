import { Client, Message } from "@open-wa/wa-automate";

import search from "youtube-search";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
require("dotenv").config();
import path from "path";
import fs from "fs";

async function ytDownload(client: Client, message: Message) {
    const { id, from, body, caption } = message;
    
    return await client.react(id, "❌");

    const outputPath = path.resolve(__dirname, '../media/yt');
    try {
        const YD = new YoutubeMp3Downloader({
            ffmpegPath: process.env.ffmpegPath,       // FFmpeg binary location
            outputPath: outputPath,                       // Output file location (default: the home directory)
            youtubeVideoQuality: "highestaudio",        // Desired video quality (default: highestaudio)
            queueParallelism: 3,                        // Download parallelism (default: 1)
            progressTimeout: 1000,                      // Interval in ms for the progress reports (default: 1000)
            allowWebm: false,                           // Enable download from WebM sources (default: false)
        });

        const commands = caption || body || "";
        const args = commands.split(" ");

        var opts = {
            maxResults: 1,
            key: "AIzaSyAkOcHe3MCzmdMMPWx_ArbsesltVvJwac4",
        };

        const pesq = args.slice(1).join(" ");

        await client.react(id, '👌');
        search(pesq, opts, async function (err: any, results: any) {
            if (err) return console.log(err);
            console.log("results", results);
            YD.download(results[0].id, `${results[0].id}.mp3`);
            await client.reply(from, `Achei esse vídeo, já já te mando.\nTitulo: ${results[0].title}\nLink: ${results[0].link}\nCanal: ${results[0].channelTitle}`, id);

            YD.on("finished", async function (err: any, data: any) {
                console.log("Finished downloading: " + data.file);
                const dist = path.resolve(__dirname, `../media/yt/${results[0].id}.mp3`)
                // await client.sendFile(message.from, dist, message.id, '', message.id, false, true);
                await client.sendAudio(message.from, dist);
                console.log("SEND FILE");
                // setTimeout(() => {
                //     try {
                //         fs.unlinkSync(dist);
                //         console.log("File removed:", dist);
                //     } catch (err) {
                //         console.error("error in unlink", err);
                //     }
                // }, 10000);
            });

            YD.on("error", async function (error: any) {
                console.log(error);
                await client.reply(from, `Não consegui baixar sua música. Tenta outra aí.\n${error}`, id);
            });

            YD.on("progress", async function (progress: any) {
                await client.reply(from, `Calma ai que eu já baixei ${progress.progress.percentage.toFixed(2)}%\nFaltam apenas ${progress.progress.eta} segundos.`, id);
            });
        });
    } catch (error) {
        await client.reply(from, `Deu merda, mostra isso para o Kauã:\n${error}`, id);
    }
}

export default ytDownload;