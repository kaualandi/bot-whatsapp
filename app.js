const { create, Client} = require('@open-wa/wa-automate')
const msgHandler = require('./msgHndlr')
const options = require('./config/options')
require('dotenv').config()


const start = async (client = new Client()) => {
    console.log('\x1b[1;32m✓ USING:',process.env.USING,'\x1b[0m');
    console.log('\x1b[1;32m✓ NUMBER:',await client.getHostNumber(),'\x1b[0m');
    console.log('\x1b[1;32m[SERVER] Servidor iniciado!\x1b[0m')

        client.onStateChanged((state) => {
            console.log('[Status do cliente]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })

        // listening on message
        client.onMessage((async (message) => {

            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })

            msgHandler(client, message)

        }))
        exports.client = client
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
