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
	const hdr = {'Subscription-Key': '3009d4ccc29e4808af1ccc25c69b4d5d'}
	const url = 'https://api.smartable.ai/coronavirus/stats/US'
	
	console.log('fetching...')
	
	const hdrInst = new Headers(hdr)

	const req = new Request(url, {
		method: 'GET',
		headers: hdrInst,
		mode: 'cors',
		cache: 'default',
	})

	fetch(req)
	.then(data => data.json())
	.then(data => {
		const dayDict = parseInfo(data.stats.history)
		console.log('dayDict: ', dayDict)
		fillTable(dayDict)
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
	for(i=0; i<dates.length-1; i++) {
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

	let ci_m1 = new CovidInfo(new Date(firstDt - 1000 * 360 * 24))
	ci_m1.confirmed = 0
	ci_m1.deaths = 0
	ci_m1.recovered = 0

	const dayDict = {}
	for (i=0; i<hist.length-1; i++) {
		const h = hist[i] 
		const dt = new Date(h.date + ".000Z")
		const ci = new CovidInfo( dt )
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
	for (i=0; i<data.length - 1; i++) {
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

class CovidInfo {
	constructor(dt) {
		this.date_ = dt
		this.newCases_ = -1
		this.cases_ = -1
		this.newDeaths_ = -1
		this.deaths_ = -1
		this.recovered_ = -1
		this.newRecovered_ = -1
	}
	
	get dayString () { return this.date_.toISOString().substring(0,10) }
	get date () { return this.date_ }
	get newCases () { return this.newCases_}
	get cases () { return this.cases_}
	get newDeaths () { return this.newDeaths_ }
	get deaths () { return this.deaths_ }
	get newRecovered () { return this.newRecovered_ }
	get recovered () { return this.recovered_ }


	set newCases (newCases) { this.newCases_ = newCases }
	set cases (cases) { this.cases_ = cases }
	set newDeaths (newDeaths) { this.newDeaths_ = newDeaths }
	set deaths (deaths) { this.deaths_ = deaths }
	set newRecovered (newRecovered) { this.newRecovered_ = newRecovered }
	set recovered (recovered) { this.recovered_ = recovered }
}

class JsonHolder {
	constructor () {
		this.confirmed_ = []
		this.recovered_ = []
		this.deaths_ = []
	}

	get confirmed () { return this.confirmed_ }
	get recovered () { return this.recovered_ }
	get deaths () { return this.deaths_  }

	set confirmed (confirmed) { this.confirmed_ = confirmed }
	set recovered (recovered) { this.recovered_ = recovered }
	set deaths (deaths) { this.deaths_ = deaths }

	firstDate() { return Math.min(new Date(this.confirmed[0].Date), 
																new Date(this.deaths[0].Date), 
																new Date(this.recovered[0].Date)) 
							}
	lastDate() { return Math.max(new Date(this.confirmed[this.confirmed.length-1].Date), 
																new Date(this.deaths[this.deaths.length-1].Date), 
																new Date(this.recovered[this.recovered.length-1].Date)) 
							}
}
