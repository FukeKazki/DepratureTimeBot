import express from 'express'
import {
	Client,
	middleware,
	MiddlewareConfig,
	ClientConfig,
} from '@line/bot-sdk'
import crypto from 'crypto'
import dotenv from 'dotenv'
import {getDepartureTimes} from './scraping'

dotenv.config()

const app = express()

const config: MiddlewareConfig & ClientConfig = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN as string,
	channelSecret: process.env.CHANNEL_SECRET as string,
}

const client = new Client(config)
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.status(200).send('hello line bot')
})

app.post('/webhook', middleware(config), async (req, res) => {
	res.status(200).end()

	if (!validateSignature(req.headers['x-line-signature'], req.body)) return undefined
	// main
	const event = req.body.events[0]
	const message = event.message.text
	console.log(event)
	if (message !== '発') return undefined
	const replyToken = event.replyToken
	const replyText = await getDepartureTimes()
	console.log(replyText)

	await reply(replyToken, replyText)
})

const reply = async (token: string, message: any) => {
	try {
		// const result = await client.replyMessage(token, {
		// 	type: 'text',
		// 	text: text
		// })
		const result = await client.replyMessage(token, {
			type: 'flex',
			altText: 'This is a Flex Message',
			contents: message,
		})
		console.log('送信成功')
	} catch (error) {
		console.log('送信失敗')
		console.error(`${error}`)
	}
}

// LINEから送られてきたものかどうかの検証
const validateSignature = (signature: any, body: any) => {
	return signature === crypto.createHmac('SHA256', config.channelSecret).update(JSON.stringify(body)).digest('base64');
}

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`))