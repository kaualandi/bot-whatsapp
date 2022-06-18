const search = require("youtube-search");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
require("dotenv").config();

exports.yt = async function yt(client, message) {
    const { id, from, body, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message;

    try {
        const YD = new YoutubeMp3Downloader({
            "ffmpegPath": process.env.ffmpegPath,        // FFmpeg binary location
            "outputPath": "../media",               // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });

        const commands = caption || body || "";
        const args = commands.split(" ");

        const opts = {
            maxResults: 1,
            key: "AIzaSyAkOcHe3MCzmdMMPWx_ArbsesltVvJwac4",
        };

        const pesq = args.slice(1).join(" ");
        search(pesq, opts, async function (err, results) {
            if (err) return console.log(err);
            YD.download(results[0].id, results[0].id + '.mp3');
            client.reply(from, "Estou procurando o vídeo", id);
            client.reply(from, `Busquei por *${pesq}* e achei:\n*Titulo:* ${results[0].title}\n*Link:*  ${results[0].link}\n*Canal:* ${results[0].channelTitle}\nEstou cantando ela e já já te mando`, id);

            YD.on("finished", function (err, data) {
                client.sendFile(from, `../media/${results[0].id}.mp3`, `${results[0].title}.mp3`, results[0].title, id);
                // client.sendPtt(from, `../media/${results[0].id}.mp3`, id);
            });

            YD.on("error", function (error) {
                client.reply(from, `Deu merda veii, mostra isso para o Kauã:\n ${error}`, id);
                console.log(error);
            });

            console.log("SEDDING MUSIC");
        });


    } catch (e) {
        console.log(e);
        client.reply(from, `Deu merda veii, mostra isso para o Kauã:\n ${e}`, id);
    }
}