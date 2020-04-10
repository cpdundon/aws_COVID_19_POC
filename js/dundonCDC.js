// Module with code for the CDC graphing application
$(document).ready(main)

function main () {
	$("#get-data").click(getData)
	console.log("main running!")
} 

const getData = () => {
	const url = 'https://api.covid19api.com/total/country/us/status/confirmed'

	fetch(url)
		.then(data => data.text())
		.then((text) => {
			let json = JSON.parse(text)
			console.log('request succeeded with JSON response')
			// console.log(json)
			console.log('Array length: ', json.length)
			fillTable(json)
		}).catch(function (error) {
			console.log('request failed', error)
		});

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
		html += "<td>" + nfObject.format(cases) + "</td>"
		html += "<td>" + nfObject.format(cases - cases_m1) + "</td>"
		html += "</tr>"
	}

	$(html).insertAfter("tr#head-tr")
} 
