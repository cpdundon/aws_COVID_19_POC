// ==========================================
// CODE TO EXECUTE PLOTS GOES BELOW
// ==========================================

//export {plotCum, plotDiffs}

export const plotCum = dayDict  => {
	
	const trace1 = newTrace(dayDict, 'Confirmed', 'orange')
	const trace2 = newTrace(dayDict, 'Deaths', 'black')
	const trace3 = newTrace(dayDict, 'Recoveries', 'green')
	const data = [trace1, trace2, trace3]; 
			
	const layout = getLayout('US COVID-19 Cumulative Statistics -- Log Scale')
	
	Plotly.newPlot('cum-data', data, layout);
}



export const plotDiffs = dayDict  => {
	
	const trace1 = newTrace(dayDict, 'New Confirmed', 'orange')
	const trace2 = newTrace(dayDict, 'New Deaths', 'black')
	const trace3 = newTrace(dayDict, 'New Recoveries', 'green')
	const data = [trace1, trace2, trace3]; 
			
	const layout = getLayout('US COVID-19 New Cases -- Log Scale')

	Plotly.newPlot('day-on-day', data, layout);
}

const getLayout = title => {	
	const layout = {
		title: title,
		xaxis: {
			title: 'Date',
			titlefont: {
				family: 'Arial, sans-serif',
				size: 18,
				color: 'grey'
			},
			showticklabels: true,
			tickangle: 45,
			tickfont: {
				family: 'Old Standard TT, serif',
				size: 16,
				color: 'black'
			}
		},
		yaxis: {
			type: 'log',
			title: 'Cases',
			titlefont: {
				family: 'Arial, sans-serif',
				size: 18,
				color: 'grey'
			},
			showticklabels: true,
			tickangle: 45,
			tickfont: {
				family: 'Old Standard TT, serif',
				size: 16,
				color: 'black'
			}
		}
	}

	return layout
}

const newTrace = (dayDict, name, color) => {
	const data = {}

	parseDict(dayDict, data, name)
	
	const trace = {
    type: "bar",
    mode: "lines",
    name: name,
    x: data['x'],
    y: data['y'],
    marker: {color: color}
  }
	
	return trace
}

const parseDict = (dayDict, data, stream) => {
	const nfObject = new Intl.NumberFormat('en-US') 
	const dates = Object.keys(dayDict)
	dates.sort()

	const yValues = []
	for(let i=0; i<dates.length; i++) {
		const ci = dayDict[dates[i]]
	
		switch (stream) {
			case 'Confirmed':
				yValues.push(ci.cases)
				break
			case 'Deaths':
				yValues.push(ci.deaths)
				break
			case 'Recovered':
				yValues.push(ci.recovered)
				break
			case 'New Confirmed':
				yValues.push(ci.newCases)
				break
			case 'New Deaths':
				yValues.push(ci.newDeaths)
				break
			case 'New Recovered':
				yValues.push(ci.newRecovered)
				break
			default:
				yValues.push(-1)
		}	
	}
	data['y'] = yValues
	data['x'] = dates 
}
