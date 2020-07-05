"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
// TODO 料金安い順になってる -> 切り替えれるようにする
const getUrl = ({ from, to, y, m, d, hh, m2, m1 }) => {
    return encodeURI(`https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from=${from}&tlatlon=&togid=&to=${to}&viacode=&via=&viacode=&via=&viacode=&via=&y=${y}&m=${m}&d=${d}&hh=${hh}&m2=${m2}&m1=${m1}&type=1&ticket=ic&expkind=1&userpass=1&ws=1&s=1&kw=${to}`);
};
exports.fetchDepartureTimes = async () => {
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
    const url = getUrl(parameter);
    const { data } = await axios_1.default.get(url);
    const $ = cheerio_1.default.load(data);
    //@ts-ignore
    const departureTimes = Array.from($('#rsltlst ul li.time'), (x) => $(x).text().match(/\d{2}/g));
    return { departureTimes, parameter, url };
};
