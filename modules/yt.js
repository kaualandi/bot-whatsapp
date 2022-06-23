const search = require("youtube-search");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
require("dotenv").config();
const path = require("path");

exports.yt = async function yt(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    try {
        const YD = new YoutubeMp3Downloader({
            // "ffmpegPath": process.env.ffmpegPath,       // FFmpeg binary location
            ffmpegPath: '/usr/bin/ffmpeg',       // FFmpeg binary location
            outputPath: "./yt",                        // Output file location (default: the home directory)
            youtubeVideoQuality: "highestaudio",        // Desired video quality (default: highestaudio)
            queueParallelism: 3,                        // Download parallelism (default: 1)
            progressTimeout: 1000,                      // Interval in ms for the progress reports (default: 1000)
            allowWebm: false,                           // Enable download from WebM sources (default: false)
        });

        const commands = caption || body || "";
        const args = commands.split(" ");

        var opts = {
            maxResults: 1,
            key: "AIzaSyARsUt7mpnrM__x-uA95qkKAArXop6j2Bo",
        };

        const pesq = args.slice(1).join(" ");
        search(pesq, opts, async function (err, results) {
            if (err) return console.log(err);

            YD.download(results[0].id, `${results[0].id}.mp3`);
            client.reply(message.from, "Estou procurando o vídeo", message.id);
            client.reply(from, `Achei esse vídeo, já já te mando.\nTitulo: ${results[0].title}\nLink: ${results[0].link}\nCanal: ${results[0].channelTitle}`,id);

            YD.on("finished", function (err, data) {
                console.log("Finished downloading: " + data);
                client.sendFile(message.from, `./yt/${results[0].id}.mp3`, message.id);
                console.log("SEDDING FILE");
            });

            YD.on("error", function (error) {
                client.reply(from, `Não consegui baixar sua música vei.\n${error}`, id);
            });

            YD.on("progress", function (progress) {
                client.reply(`Calma ai que eu já baixei: ${progress.progress.percentage.toFixed(2)}%\nFaltam apenas ${progress.progress.eta} segundos para terminar de baixar!!!`);
            });
        });
    } catch (error) {
        client.reply(from, `Deu merda, mostra isso para o Kauã:\n${error}`, id);
    }
}