import moment from 'moment'
import cheerio from 'cheerio'
import axios from 'axios'

import {url_parameter} from "./types"

// TODO 料金安い順になってる -> 切り替えれるようにする
const getUrl = ({from, to, y, m, d, hh, m2, m1}: url_parameter): string => {
	return encodeURI(`https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from=${from}&tlatlon=&togid=&to=${to}&viacode=&via=&viacode=&via=&viacode=&via=&y=${y}&m=${m}&d=${d}&hh=${hh}&m2=${m2}&m1=${m1}&type=1&ticket=ic&expkind=1&userpass=1&ws=1&s=1&kw=${to}`)
}

export const fetchDepartureTimes = async (): Promise<any> => {
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

	const url = getUrl(parameter)

	const {data} = await axios.get(url)

	const $ = cheerio.load(data)
	//@ts-ignore
	const departureTimes = Array.from($('#rsltlst ul li.time'), (x: string) => $(x).text().match(/\d{2}/g))

	return {departureTimes, parameter, url}
}