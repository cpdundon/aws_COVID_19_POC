import * as PlotCOVID from './plotCOVID.js'
import * as DataStruct from './dataObj.js'

// Module with code for the CDC graphing application
$(document).ready(main)

function main () {
	$("#get-data").click(getData)
	console.log("main running!")
} 

const getData = () => {
	fetchData ()
}

const fetchData = () => {
	const hdr = {}
	hdr["Subscription-Key"] =  '3009d4ccc29e4808af1ccc25c69b4d5d'
	hdr["Access-Control-Allow-Origin"] = "http://localhost:8000"
	hdr["Vary"] = "Origin"
	
	const url = 'https://api.smartable.ai/coronavirus/stats/US'
	
	console.log('fetching...')
	
	const hdrInst = new Headers(hdr)

	const req = new Request(url, {
		method: 'GET',
		headers: hdrInst,
		mode: 'cors',
		cache: 'default',
		redirect: 'follow',
	})

	fetch(req)
	.then(data => data.json())
	.then(data => {
		const dayDict = parseInfo(data.stats.history)
		console.log('dayDict: ', dayDict)
		fillTable(dayDict)
		PlotCOVID.plotDiffs(dayDict)
		PlotCOVID.plotCum(dayDict)
	})
   .catch(error => console.log('request failed ', error))
	
}

const fetchData_ParseAll = () => {
	const url_c = 'https://api.covid19api.com/total/country/us/status/confirmed'
	const url_d = 'https://api.covid19api.com/total/country/us/status/deaths'
	const url_r = 'https://api.covid19api.com/total/country/us/status/recovered'
	const urlArr = [url_c, url_d, url_r]
	const info = new JsonHolder()

	console.log('fetching...')
	
	Promise.all(urlArr.map(url =>
  fetch(url)        
    .then(data => data.json())
    .catch(error => console.log('request failed ', error))
	))
	.then(data => {
		info.confirmed = data[0]
		info.deaths = data[1]
		info.recovered = data[2]
		console.log(info)

		return info
	})
	.then(info => {
		const dayDict = parseInfo(info)
		console.log('dayDict: ', dayDict)
		fillTable(dayDict)
	})
}

const fillTable = (dayDict) => {
	const nfObject = new Intl.NumberFormat('en-US') 
	const dates = Object.keys(dayDict)
	dates.sort()

	let html = ''
	for(let i=dates.length-1; i>=0; i--) {
		const ci = dayDict[dates[i]]
		
		html += "<tr>"
		html += "<td>" + dates[i] + "</td>"
		html += "<td>" + nfObject.format(ci.newCases) + "</td>"
		html += "<td>" + nfObject.format(ci.cases) + "</td>"
		html += "<td>" + nfObject.format(ci.newRecovered) + "</td>"
		html += "<td>" + nfObject.format(ci.recovered) + "</td>"
		html += "<td>" + nfObject.format(ci.newDeaths) + "</td>"
		html += "<td>" + nfObject.format(ci.deaths) + "</td>"
		html += "</tr>"
	}
	
	$(html).insertAfter("tr#head-tr")
}

const parseInfo = (hist) => {
	const firstDt = new Date(hist[0].date + ".000Z") 

	let ci_m1 = new DataStruct.CovidInfo(new Date(firstDt - 1000 * 360 * 24))
	ci_m1.cases = 0
	ci_m1.deaths = 0
	ci_m1.recovered = 0

	const dayDict = {}
	for (let i=0; i<hist.length-1; i++) {
		const h = hist[i] 
		const dt = new Date(h.date + ".000Z")
		const ci = new DataStruct.CovidInfo( dt )
		dayDict[dt.toISOString().substring(0,10)] = ci

		ci.cases = h.confirmed
		ci.deaths = h.deaths
		ci.recovered = h.recovered

		ci.newCases = h.confirmed - ci_m1.cases
		ci.newDeaths = h.deaths - ci_m1.deaths
		ci.newRecovered = h.recovered - ci_m1.recovered
		
		ci_m1 = ci
		
	}
	return dayDict
}

const parseOneSet = (dayDict, data, setName) => {
	let cases_m1 = 0
	for (let i=0; i<data.length - 1; i++) {
		const dtStr = data[i].Date.substring(0,10)
		const ci = dayDict[dtStr]
		const cases = parseInt(data[i].Cases)
		const diff = cases - cases_m1
		
		switch (setName) {
			case 'confirmed':
				ci.cases = cases
				ci.newCases = diff
				break
			case 'deaths':
				ci.deaths = cases
				ci.newDeaths = diff
				break
			case 'recovered':
				ci.recovered = cases
				ci.newRecovered = diff
				break
			default:
				ci.cases = -1
				ci.deaths = -1
				ci.recovered = -1
		}	
		cases_m1 = cases
	}
}
