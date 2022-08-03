const search = require("youtube-search");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

exports.yt = async function yt(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

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
        search(pesq, opts, async function (err, results) {
            if (err) return console.log(err);
            console.log("results", results);
            YD.download(results[0].id, `${results[0].id}.mp3`);
            await client.reply(message.from, "Estou procurando o vídeo", message.id);
            await client.reply(from, `Achei esse vídeo, já já te mando.\nTitulo: ${results[0].title}\nLink: ${results[0].link}\nCanal: ${results[0].channelTitle}`, id);

            YD.on("finished", async function (err, data) {
                console.log("Finished downloading: " + data);
                const dist = path.resolve(__dirname, `../media/yt/${results[0].id}.mp3`)
                await client.sendFile(message.from, dist, message.id);
                console.log("SEND FILE");
                try {
                    fs.unlinkSync(dist);
                    console.log("File removed:", dist);
                } catch (err) {
                    console.error("error in unlink", err);
                }
            });

            YD.on("error", async function (error) {
                console.log(error);
                await client.reply(from, `Não consegui baixar sua música vei.\n${error}`, id);
            });

            YD.on("progress", async function (progress) {
                await client.reply(`Calma ai que eu já baixei ${progress.progress.percentage.toFixed(2)}%\nFaltam apenas ${progress.progress.eta} segundos.`);
            });
        });
    } catch (error) {
        await client.reply(from, `Deu merda, mostra isso para o Kauã:\n${error}`, id);
    }
}