"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_sdk_1 = require("@line/bot-sdk");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const scraping_1 = require("./scraping");
dotenv_1.default.config();
const app = express_1.default();
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
const client = new bot_sdk_1.Client(config);
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.status(200).send('hello line bot');
});
app.post('/webhook', bot_sdk_1.middleware(config), async (req, res) => {
    res.status(200).end();
    if (!validateSignature(req.headers['x-line-signature'], req.body))
        return undefined;
    // main
    const event = req.body.events[0];
    const message = event.message.text;
    console.log(event);
    if (message !== '発')
        return undefined;
    const replyToken = event.replyToken;
    const replyText = await scraping_1.getDepartureTimes();
    console.log(replyText);
    await reply(replyToken, replyText);
});
const reply = async (token, message) => {
    try {
        // const result = await client.replyMessage(token, {
        // 	type: 'text',
        // 	text: text
        // })
        const result = await client.replyMessage(token, {
            type: 'flex',
            altText: 'This is a Flex Message',
            contents: message,
        });
        console.log('送信成功');
    }
    catch (error) {
        console.log('送信失敗');
        console.error(`${error}`);
    }
};
// LINEから送られてきたものかどうかの検証
const validateSignature = (signature, body) => {
    return signature === crypto_1.default.createHmac('SHA256', config.channelSecret).update(JSON.stringify(body)).digest('base64');
};
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
