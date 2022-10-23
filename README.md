<h1 align="center">Olá, bem vindo! 👋</h1>
<p align="center">
<img alt="Versão" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
<img alt="Licença: APACHE 2.0" src="https://img.shields.io/badge/License-APACHE 2.0-yellow.svg" />
<img alt="npm version" src="https://img.shields.io/npm/v/@open-wa/wa-automate.svg?color=green"/>
<img alt="node-version" src="https://img.shields.io/node/v/@open-wa/wa-automate"/>
<img alt="made-with-node" src="https://img.shields.io/badge/Made%20with-node-1f425f.svg"/>

</p>

> Olá, esse bot de whatsapp foi criado para trabalhar em conjunto com Express.JS para enviar mensagens usando request.

## Instalando bot

```bash
git clone https://github.com/kaualandi/wa-bot-express.git
```

```bash
cd wa-bot-express
```

```bash
npm install
```

## Variáveis de ambiente

Você precisará de um arquivo `.env` parecido com esse:

```env
USING=DEVELOPMENT ENVIRONMENT VARIABLES
PORT=3333
```

Basta agora preencher os dados:

- **USING:** É figurativo, apenas se mostrará qual variável está sendo usada, no caso de ter duas.
- **PORT:** Define a porta que será servido seus endpoints. Se você não alterar usará 3333.

## Endpoint

- **POST /send-text:** Envia uma mensagem para o número informado.

```json
{
  "number": "5511999999999",
  "message": "Olá, tudo bem?"
}
```

> Surgirão mais conforme a necessidade.

## Execução do Bot

```bash
npm start
```

Escaneie o QR Code como se estivesse conectando ao whatsapp web e dê _send_ na requisição.

> Não se esqueça de verificar se o multidevices (Multiplos Dispositivos) está ativado em seu whatsapp.
