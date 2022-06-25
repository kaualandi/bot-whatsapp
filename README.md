<h1 align="center">Olá, bem vindo! 👋</h1>
<p align="center">
<img alt="Versão" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
<img alt="Licença: APACHE 2.0" src="https://img.shields.io/badge/License-APACHE 2.0-yellow.svg" />
<img alt="npm version" src="https://img.shields.io/npm/v/@open-wa/wa-automate.svg?color=green"/>
<img alt="node-version" src="https://img.shields.io/node/v/@open-wa/wa-automate"/>
<img alt="made-with-node" src="https://img.shields.io/badge/Made%20with-node-1f425f.svg"/>

</p>

> Olá, esse bot de whatsapp foi criado com foco em atendimento ao cliente.

## Instalando bot
```bash
git clone https://github.com/kaualandi/bot-whatsapp.git
```
```bash
cd bot-whatsapp
```
```bash
npm install
```

## Variáveis de ambiente
Você precisará de um arquivo `.env` parecido com esse:
```env
USING=PRODUCTION ENVIRONMENT VARIABLES
MAINTENANCE_MODE=false
BASEURL_BOTINFORS=http://localhost:3200

TOKEN_CONSULTAS=
BASE_URL_CONSULTAS=

ffmpegPath=/usr/bin/ffmpeg
```
Basta agora preencher os dados:
- **USING:** é figurativo, apenas se mostrará qual variável está sendo usada, no caso de ter duas.
- **MAINTENANCE_MODE:** é um flag que indica se o bot está em modo de manutenção, se `true` ele responderá avisando seu estado e não fará mais nada.
- **BASEURL_BOTINFORS:** se você não alterar o script server do `package.json` será por padrão `http://localhost:3004`. É essencial para o funcionamento do bot.
- **ffmpegPath:** Diretório do ffmpeg, para baixar músicas com o comando `!yt`. Caso não tenha, veja como baixar [aqui](https://www.ffmpeg.org/download.html).

Os demais são dados do cliente, sendo assim não são necessários preencher.

## Server
> Eu disse acima da *BASEURL_BOTINFORS*, pois bem, aqui vamos configura-lo.

```bash
cd server
```

Precisamos de um arquivo para armazenar todas as informações

```bash
touch db.json
```

Agora abra esse arquivo em seu editor de textos e cole o objeto abaixo

```json
{
  "authorizations": []
}
```

### Ambiente de Desenvolvimento

Caso não tenha o [json-server](https://www.npmjs.com/package/json-server) globalmente, o instale.

```bash
npm install -g json-server
```

Se estiver no ambiente de desenvolvimento, é só rodar o `npm run server` ou `npm run server:w`, caso queira no modo watch.

Dessa forma, caso queria alterar a porta, você encontrará no arquivo `package.json` em `scripts`, busque por `server` e `server:w` altere a porta que fica após a flag `--port`.

### Ambiente de Produção

Acredito que você não queria que o server fique ocupando uma instância do terminal. Devemos então prepará-lo para o [PM2](https://pm2.keymetrics.io/).

> Não ensinarei aqui como configurar o [PM2](https://pm2.keymetrics.io/). Mas se quiser, você pode ver o [guia](https://pm2.keymetrics.io/docs/usage/quick-start/) para isso.

Se ainda não estiver, entre na pasta do servidor

```bash
cd server
```
```bash
npm install
```
Você pode alterar a porta do server acessando a linha 5 da `index.js` da pasta `server`.

Inicie o server com o PM2:
```bash
pm2 start index.js --name wabot-server
```

## Execução do Bot
> Se você não tiver todas as variáveis de ambiente preenchidas, precisará rever em que parte elas são requeridas e preencher com outra coisa. Sugiro ver os arquivos `fetch.js` e `steps.js`.

Volte para a pasta raíz do bot:
```bash
cd ..
```

```bash
npm start
```

Escaneie o QR Code como se estivesse conectando ao whatsapp web e mande um `!menu` para o número que usou para escanear.

> Não se esqueça de verificar se o multidevices (Multiplos Dispositivos) está ativado em seu whatsapp.

Se quiser usar o pm2, execute:
```bash
pm2 start index.js --name wabot-bot
```
## Autor

👤 **Kauã Landi**

* Website: https://kaualf.netlify.app
* Github: [@kaualandi](https://github.com/kaualandi)
* LinkedIn: [@kaualandi](https://linkedin.com/in/kaualandi)
* Instagram: [@kaua.landi](https://www.instagram.com/kaua.landi/)

## 🤝 Contribuição

Contribuições, problemas e solicitações de recursos são bem-vindos! <br/> Sinta-se à vontade para verificar a [página de problemas](https://github.com/kaualandi/wabot-atendimento/issues). Você também pode dar uma olhada na [página de contribuição](https://github.com/kaualandi/wabot-atendimento/pulls).

## 🥰 Mostre seu apoio

Dê uma ⭐️ se este projeto te ajudou!
