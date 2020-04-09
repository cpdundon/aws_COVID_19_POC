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
			console.log(json)
			console.log('Array length: ', json.length)
			fillTable(json)
		}).catch(function (error) {
			console.log('request failed', error)
		});

}

const fillTable = (json) => {
	let html = ''
	let cases_m1 = 0

	console.log("filling table")

	for(i=0; i<json.length; i++) {
		let cases = json[i].Cases

		html += "<tr>"
		html += "<td>" + json[i].Date + "</td>"
		html += "<td>" + cases + "</td>"
		html += "<td>" + (cases - cases_m1) + "</td>"
		html += "</tr>"

		cases_m1 = cases
	}
	
	console.log('html... ', html)
	$(html).insertAfter("tr#head-tr")
} 
