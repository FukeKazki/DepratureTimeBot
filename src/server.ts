import express from 'express'
import {
	Client,
	middleware,
	MiddlewareConfig,
	ClientConfig,
} from '@line/bot-sdk'
import crypto from 'crypto'
import dotenv from 'dotenv'

import {fetchDepartureTimes} from './scraping'
import {createHeaderText, createBodyTexts, createMessage} from "./message"


dotenv.config()

const config: MiddlewareConfig & ClientConfig = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN as string,
	channelSecret: process.env.CHANNEL_SECRET as string,
}

const app = express()
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
	// 絞る
	if (message !== '発') return undefined

	const replyToken = event.replyToken

	try {
		const {departureTimes, parameter, url} = await fetchDepartureTimes()

		const headerText = createHeaderText(departureTimes[0])
		const bodyTexts = createBodyTexts(departureTimes)
		const replyMessage = createMessage(headerText, bodyTexts, parameter, url)

		await replyFlexMessage(replyToken, replyMessage)
	} catch (error) {
		console.error(`${error}`)
		// Todo: 失敗したことを知らせるリプライ
	}
})

const replyFlexMessage = async (token: string, message: any): Promise<void> => {
	try {
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