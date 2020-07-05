import {FlexContainer} from "@line/bot-sdk"
import {url_parameter} from "./types"

export const createMessage = (
	headerText: string,
	bodyTexts: Array<{ hatu: string, tyaku: string }>,
	parameter: url_parameter,
	url: string
): FlexContainer => {
	const template: FlexContainer =
		{
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

	if (bodyTexts[1]) {
		template.body?.contents.push({
			"type": "separator"
		}, {
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
		})
	}

	if (bodyTexts[2]) {
		template.body?.contents.push({
			"type": "separator"
		}, {
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
			"paddingTop": "10px",
			"paddingBottom": "10px",
		})
	}

	return template
}

export const createHeaderText = (arr: Array<string>): string => {
	return `${arr[0]}:${arr[1]} → ${arr[2]}:${arr[3]}`
}

export const createBodyTexts = (departureTimes: Array<string>): Array<{ hatu: string, tyaku: string }> => {
	return departureTimes.map(x => {
		return {
			hatu: `${x[0]}時${x[1]}分`,
			tyaku: `${x[2]}時${x[3]}分`,
		}
	})
}