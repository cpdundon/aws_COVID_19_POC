export class CovidInfo {
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

export class JsonHolder {
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

