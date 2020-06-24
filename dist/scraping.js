"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const setTemplate = (headerText, bodyTexts, parameter, url) => {
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
                bodyTexts[1] && ({
                    "type": "separator"
                }),
                bodyTexts[1] && ({
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
                }),
                bodyTexts[2] && ({
                    "type": "separator"
                }),
                bodyTexts[2] && ({
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
                }),
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
    };
};
const createHeaderText = (arr) => {
    return `${arr[0]}:${arr[1]} → ${arr[2]}:${arr[3]}`;
};
const createText = (departureTimes, parameter, url) => {
    const headerText = createHeaderText(departureTimes[0]);
    console.log(headerText);
    const bodyTexts = departureTimes.map(x => {
        return {
            hatu: `${x[0]}時${x[1]}分`,
            tyaku: `${x[2]}時${x[3]}分`,
        };
    });
    console.log(bodyTexts);
    const result = setTemplate(headerText, bodyTexts, parameter, url);
    // return departureTimes.map(x => {
    // 	return `${x[0]}時${x[1]}分発\n${x[2]}時${x[3]}分着\n---------------\n`
    // })
    return result;
};
exports.getDepartureTimes = async () => {
    // TODO 料金安い順になってる -> 切り替えれるようにする
    const setUrl = ({ from, to, y, m, d, hh, m2, m1 }) => {
        return encodeURI(`https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from=${from}&tlatlon=&togid=&to=${to}&viacode=&via=&viacode=&via=&viacode=&via=&y=${y}&m=${m}&d=${d}&hh=${hh}&m2=${m2}&m1=${m1}&type=1&ticket=ic&expkind=1&userpass=1&ws=1&s=1&kw=${to}`);
    };
    const parameter = {
        from: '小倉',
        to: '八幡',
        y: moment_1.default().year().toString(),
        m: (moment_1.default().month() + 1).toString().padStart(2, '0'),
        d: moment_1.default().date().toString().padStart(2, '0'),
        hh: moment_1.default().hour().toString().padStart(2, '0'),
        m2: moment_1.default().minute().toString().padStart(2, '0')[1],
        m1: moment_1.default().minute().toString().padStart(2, '0')[0],
    };
    const url = setUrl(parameter);
    const { data } = await axios_1.default.get(url);
    const $ = cheerio_1.default.load(data);
    //@ts-ignore
    const departureTimes = Array.from($('#rsltlst ul li.time'), (x) => $(x).text().match(/\d{2}/g));
    console.log(departureTimes);
    const sentence = createText(departureTimes, parameter, url);
    // console.log(`${parameter.from} -> ${parameter.to}`)
    // const replay = sentence.reduce((previousValue, currentValue) => previousValue + currentValue, '')
    // return `${parameter.from} -> ${parameter.to}\n${replay}`
    return sentence;
};
