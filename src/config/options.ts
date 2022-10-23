import { Client, ConfigObject, NotificationLanguage } from "@open-wa/wa-automate"

export default function options(headless: boolean, start: (client: Client) => Promise<Client>) {
    const options: ConfigObject = {
        blockCrashLogs: false,
        disableSpins: false,
        hostNotificationLang: NotificationLanguage.PTBR,
        logConsole: false,
        //popup: true,

        viewport: {
            width: 1920,
            height: 1200
        },
        popup: 3012,
        multiDevice: true,
        defaultViewport: null,
        sessionId: 'wa-bot-express',
        headless: headless,
        qrTimeout: 0,
        authTimeout: 60,
        restartOnCrash: start,
        cacheEnabled: true,
        useChrome: true,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: true,

    }
    return options
}