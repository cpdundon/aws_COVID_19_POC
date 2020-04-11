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
		console.log('full set of data: ', data)
		info.confirmed = data[0]
		info.deaths = data[1]
		info.recovered = data[2]
		console.log(info)
	})
}

const fillTable = (json) => {
	let html = ''
	let dt = new Date(Date.UTC(1970, 0, 1))
	let dtStr = dt.toISOString().substring(0,10)
	const nfObject = new Intl.NumberFormat('en-US') 

	console.log("filling table")

	for(i=json.length-1; i>=0; i--) {
		let cases = json[i].Cases
		let cases_m1

		if (i!==0) {
			cases_m1 = json[i-1].Cases
		} else{
			cases_m1 = 0
		}

		dt = new Date(json[i].Date)
		dtStr = dt.toISOString().substring(0,10)

		html += "<tr>"
		html += "<td>" + dtStr + "</td>"
		html += "<td>" + nfObject.format(cases - cases_m1) + "</td>"
		html += "<td>" + nfObject.format(cases) + "</td>"
		html += "</tr>"
	}

	$(html).insertAfter("tr#head-tr")
}

 
const parseInfo = (allJson, deathJson) => {
	let dt = new Date(Date.UTC(1970, 0, 1))
	let dtStr = dt.toISOString().substring(0,10)
	allBegin = new Date(allJson[0].Date)
	deathBegin = new Date(deathJson[0].Date)
	firstDt = Math.min(allBegin, deathBegin)

	allEnd = new Date(allJson[allJson.length-1].Date)
	deathEnd = new Date(deathEnd[deathJson.length-1].Date)
	lastDt = Math.max(allEnd, deathEnd)

	const dayCount = (lastDt - firstDt) / (24 * 3600 * 1000)

	const dayDict = {}
	for (i=0; i<dayCount; i++) {
		const dt = firstDt + (24 * 3600 * 1000) * i
		dayDict[dt.toISOString().substring(0,10)] = new CovidInfo( dt ) 
	}

	let cases_m1 = 0
	for (i=0; i<allJson.length - 1; i++) {
		const dtStr = allJson[i].Date.substring(0,10)
		const ci = dayDict[dtStr]
		const cases = allJson[i].Cases
		const diff = cases - cases_m1
		ci.setCases(cases)
		ci.setNewCases(diff)

		cases_m1 = cases
	}

	cases_m1 = 0
	for (i=0; i<deathJson.length - 1; i++) {
		const dtStr = deathJson[i].Date.substring(0,10)
		const ci = dayDict[dtStr]
		const cases = deathJson[i].Cases
		const diff = cases - cases_m1
		ci.setCases(cases)
		ci.setNewCases(diff)

		cases_m1 = cases
	}

	return dayDict
}

class CovidInfo {
	constructor(dt) {
		this.date = dt
		this.newCases = -1
		this.cases = -1
		this.newDeaths = -1
		this.deaths = -1
	}

	get date () { return this.date }
	get newCases () { return this.newCases}
	get cases () { return this.cases}
	get newDeaths () { return this.newDeaths }
	get deaths () { return this.deaths }

	set newCases (newCases) { this.newCases = newCases  }
	set cases (cases) {this.cases = cases }
	set newDeaths (newDeaths) { this.newDeaths = newDeaths  }
	set deaths (deaths) { this.deaths = deaths  }
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
}
