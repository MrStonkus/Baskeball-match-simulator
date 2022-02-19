const Basketball = class Basketball {
	constructor(params) {
		this.defaultParams = params
		this.par = params
		
	}

	init() {
		this.par = {...this.defaultParams}
		this.par.gameStatus = 'init'
		this.par.attackingTeam1 = [true, false][this._getRandomNumber(0, 1)],
			console.log('Game init')
	}

	start() {
		this.par.gameStatus = 'running'
		this._play()
		console.log('Game started')
	}
	pause() {
		this.par.gameStatus = 'paused'
		console.log('Game paused')
	}

	stop() {
		this.par.gameStatus = 'gameOver'
		console.log('Game over')
	}

	_play() {
		if (this.par.gameStatus !== 'running') return false

		let attackTime = this._getRandomNumber(
			this.par.attackTimeMin,
			this.par.attackTimeMax
		)

		setTimeout(() => {
			
			// calculate attacking team points
			if (this.par.attackingTeam1) {
				this.par.team1Score += this._getRandomNumber(0, 2)
			} else {
				this.par.team2Score += this._getRandomNumber(0, 2)
			}

			// calculate quarter nr
			this.par.totalTime += attackTime
			if (this.par.totalTime >= this.par.quarterTime * this.par.quarter)
				this.par.quarter++

			// check for game over
			if (this.par.quarter > 4 && this.par.team1Score != this.par.team2Score) {
				this.par.quarter = 4
				this.stop()
				return false
			}

			this.par.attackingTeam1 = !this.par.attackingTeam1
			this._play()
		}, attackTime)
	}

	_getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
}

export default Basketball
