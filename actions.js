const commands = require("./commands");

async function start(client, message) {
    const { caption, body } = message;
    const text = caption || body || "";
    let command = text.toLowerCase().split(" ")[0].split(" ")[0].split("\n")[0];
    const isCommand = text.startsWith("!") || text.startsWith("/");
    
    let commandText;

    if (isCommand) {
        commandText = command.split("").slice(1).join("");
    }
    
    try {
        await commands[commandText](client, message);
    } catch (error) {
        console.log('UNKNOWN COMMAND:', commandText);
    }
}
const actions = {
    start: (client, message) => start(client, message)
}

module.exports = actions;