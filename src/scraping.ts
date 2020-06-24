import moment from 'moment'
import cheerio from 'cheerio'
import axios from 'axios'

import {FlexContainer} from "@line/bot-sdk";

interface url_parameter {
	from: string
	to: string
	y: string
	m: string
	d: string
	hh: string
	m2: string
	m1: string
}

const setTemplate = (headerText: string, bodyTexts: Array<{hatu: string, tyaku: string}>, parameter: url_parameter, url: string): FlexContainer => {
	return {
		"type": "bubble",
		"header": {
			"type": "box",
			"layout": "vertical",
			"contents": [
				{
					"type": "text",
					"text": `${headerText}`,
					"size": "3xl",
					"margin": "none",
					"align": "center",
					"gravity": "top",
					"wrap": true,
					"style": "normal",
					"weight": "regular",
					"offsetTop": "12px"
				}
			]
		},
		"body": {
			"type": "box",
			"layout": "vertical",
			"contents": [
				{
					"type": "text",
					"text": `${parameter.from} → ${parameter.to}`,
					"size": "lg",
					"weight": "bold"
				},
				{
					"type": "box",
					"layout": "vertical",
					"margin": "lg",
					"spacing": "sm",
					"contents": [
						{
							"type": "box",
							"layout": "baseline",
							"spacing": "sm",
							"contents": [
								{
									"type": "text",
									"text": "発",
									"color": "#ff0000",
									"size": "md",
									"flex": 1
								},
								{
									"type": "text",
									"text": `${bodyTexts[0].hatu}`,
									"wrap": true,
									"color": "#666666",
									"size": "sm",
									"flex": 5
								}
							]
						},
						{
							"type": "box",
							"layout": "baseline",
							"spacing": "sm",
							"contents": [
								{
									"type": "text",
									"text": "着",
									"color": "#00ff00",
									"size": "md",
									"flex": 1
								},
								{
									"type": "text",
									"text": `${bodyTexts[0].tyaku}`,
									"wrap": true,
									"color": "#666666",
									"size": "sm",
									"flex": 5
								}
							]
						}
					],
					"paddingBottom": "10px"
				},
				bodyTexts[1] && (
					{
						"type": "separator"
					}
				),
				bodyTexts[1] && (
					{
						"type": "box",
						"layout": "vertical",
						"contents": [
							{
								"type": "box",
								"layout": "vertical",
								"margin": "lg",
								"spacing": "sm",
								"contents": [
									{
										"type": "box",
										"layout": "baseline",
										"spacing": "sm",
										"contents": [
											{
												"type": "text",
												"text": "発",
												"color": "#ff0000",
												"size": "md",
												"flex": 1
											},
											{
												"type": "text",
												"text": `${bodyTexts[1].hatu}`,
												"wrap": true,
												"color": "#666666",
												"size": "sm",
												"flex": 5
											}
										]
									},
									{
										"type": "box",
										"layout": "baseline",
										"spacing": "sm",
										"contents": [
											{
												"type": "text",
												"text": "着",
												"color": "#00ff00",
												"size": "md",
												"flex": 1
											},
											{
												"type": "text",
												"text": `${bodyTexts[1].tyaku}`,
												"wrap": true,
												"color": "#666666",
												"size": "sm",
												"flex": 5
											}
										]
									}
								]
							}
						],
						"paddingTop": "10px",
						"paddingBottom": "10px",
					}
				),
				bodyTexts[2] && (
					{
						"type": "separator"
					}
				),
				bodyTexts[2] && (
					{
						"type": "box",
						"layout": "vertical",
						"contents": [
							{
								"type": "box",
								"layout": "vertical",
								"margin": "lg",
								"spacing": "sm",
								"contents": [
									{
										"type": "box",
										"layout": "baseline",
										"spacing": "sm",
										"contents": [
											{
												"type": "text",
												"text": "発",
												"color": "#ff0000",
												"size": "md",
												"flex": 1
											},
											{
												"type": "text",
												"text": `${bodyTexts[2].hatu}`,
												"wrap": true,
												"color": "#666666",
												"size": "sm",
												"flex": 5
											}
										]
									},
									{
										"type": "box",
										"layout": "baseline",
										"spacing": "sm",
										"contents": [
											{
												"type": "text",
												"text": "着",
												"color": "#00ff00",
												"size": "md",
												"flex": 1
											},
											{
												"type": "text",
												"text": `${bodyTexts[2].tyaku}`,
												"wrap": true,
												"color": "#666666",
												"size": "sm",
												"flex": 5
											}
										]
									}
								]
							}
						],
						"paddingTop": "10px"
					}
				),
			]
		},
		"footer": {
			"type": "box",
			"layout": "vertical",
			"spacing": "sm",
			"contents": [
				{
					"type": "button",
					"style": "link",
					"height": "sm",
					"action": {
						"type": "uri",
						"label": "URL",
						"uri": `${url}`
					},
					"position": "relative",
					"margin": "none",
					"gravity": "top"
				}
			],
			"flex": 0
		}
	}
}

const createHeaderText = (arr: Array<string>): string => {
	return `${arr[0]}:${arr[1]} → ${arr[2]}:${arr[3]}`
}
const createText = (departureTimes: Array<Array<string>>, parameter: url_parameter, url: string) => {
	const headerText = createHeaderText(departureTimes[0])
	console.log(headerText)
	const bodyTexts = departureTimes.map(x => {
		return {
			hatu: `${x[0]}時${x[1]}分`,
			tyaku: `${x[2]}時${x[3]}分`,
		}
	})
	console.log(bodyTexts)
	const result = setTemplate(headerText, bodyTexts, parameter, url)
	// return departureTimes.map(x => {
	// 	return `${x[0]}時${x[1]}分発\n${x[2]}時${x[3]}分着\n---------------\n`
	// })
	return result
}

export const getDepartureTimes = async (): Promise<any> => {
// TODO 料金安い順になってる -> 切り替えれるようにする
	const setUrl = ({from, to, y, m, d, hh, m2, m1}: url_parameter): string => {
		return encodeURI(`https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from=${from}&tlatlon=&togid=&to=${to}&viacode=&via=&viacode=&via=&viacode=&via=&y=${y}&m=${m}&d=${d}&hh=${hh}&m2=${m2}&m1=${m1}&type=1&ticket=ic&expkind=1&userpass=1&ws=1&s=1&kw=${to}`)
	}

	const parameter: url_parameter = {
		from: '小倉',
		to: '八幡',
		y: moment().year().toString(),
		m: (moment().month() + 1).toString().padStart(2, '0'),
		d: moment().date().toString().padStart(2, '0'),
		hh: moment().hour().toString().padStart(2, '0'),
		m2: moment().minute().toString().padStart(2, '0')[1],
		m1: moment().minute().toString().padStart(2, '0')[0],
	}

	const url = setUrl(parameter)
	const {data} = await axios.get(url)
	const $ = cheerio.load(data)
	//@ts-ignore
	const departureTimes = Array.from($('#rsltlst ul li.time'), (x: string) => $(x).text().match(/\d{2}/g))
	console.log(departureTimes)


	const sentence = createText(departureTimes, parameter, url)
	// console.log(`${parameter.from} -> ${parameter.to}`)
	// const replay = sentence.reduce((previousValue, currentValue) => previousValue + currentValue, '')
	// return `${parameter.from} -> ${parameter.to}\n${replay}`
	return sentence
}