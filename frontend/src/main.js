
// Data Picker Initialization
// $('.datepicker').datepicker({
//   inline: true
// });

// -------------------------------- FUNCTIONS --------------------------------

function initGame(newGame = true) {
	fetch('http://127.0.0.1:3000/')
		.then((res) => res.json())
		.then((dataObj) => {
			console.log(dataObj)

			// update info-bar DOM
			document.querySelector(
				'.info-bar__round'
			).innerHTML = `Round ${dataObj.round}`
			document.querySelector('.info-bar__date').innerHTML = `${dataObj.date}`
			document.querySelector('.info-bar__stadium').innerHTML = `${dataObj.stadium}`
			document.querySelector('.info-bar__time').innerHTML = `${dataObj.time}`

			// update team1 DOM
			document.querySelector(
				'#team1-logo'
			).innerHTML = `<img src="${dataObj.team1LogoUrl}" alt="Logo of ${dataObj.team1} team."/>`
			document.querySelector('#team1-name').innerHTML = `${dataObj.team1Name}`

			// update match results DOM
			document.querySelector('#team1-score').innerHTML = `${dataObj.team1Score}`
			document.querySelector('#team2-score').innerHTML = `${dataObj.team2Score}`
			document.querySelector(
				'.match__quarter'
			).innerHTML = `Quarter ${dataObj.quarter}th`

			// update team2 DOM
			document.querySelector(
				'#team2-logo'
			).innerHTML = `<img src="${dataObj.team2LogoUrl}" alt="Logo of ${dataObj.team2} team."/>`
			document.querySelector('#team2-name').innerHTML = `${dataObj.team2Name}`

			// update action button
			document.querySelector('.match__tablo-heading').innerHTML = `Waiting`

			// add button listeners
			document.querySelector('#btn-newgame').addEventListener('click', startGame)
			document.querySelector('#btn-pause').addEventListener('click', pauseGame)
			document.querySelector('#btn-resume').addEventListener('click', resumeGame)
			document.querySelector('#btn-stop').addEventListener('click', stopGame)

			//set buttons to show
			updateButtons(['newgame'])
		})
}



function updateWebsite() {
	fetch('http://127.0.0.1:3000')
		.then((res) => res.json())
		.then((dataObj) => {
			// set color for leading team
			document
				.querySelector('#team1-score')
				.classList.remove('match__score-team--green')
			document
				.querySelector('#team2-score')
				.classList.remove('match__score-team--green')

			if (dataObj.team1Score > dataObj.team2Score) {
				document
					.querySelector('#team1-score')
					.classList.add('match__score-team--green')
			}
			if (dataObj.team2Score > dataObj.team1Score) {
				document
					.querySelector('#team2-score')
					.classList.add('match__score-team--green')
			}
			// update info tablo
			document.querySelector('#team1-score').innerHTML = `${dataObj.team1Score}`
			document.querySelector('#team2-score').innerHTML = `${dataObj.team2Score}`
			document.querySelector(
				'.match__quarter'
			).innerHTML = `Quarter ${dataObj.quarter}th`

			// update tablo header
			if (dataObj.status == 'init') {
				document.querySelector('.match__tablo-heading').innerHTML = `Waiting`
			} else if (dataObj.gameStatus == 'running') {
				document.querySelector('.match__tablo-heading').innerHTML = `Live`
			} else if (dataObj.gameStatus == 'paused') {
				document.querySelector('.match__tablo-heading').innerHTML = `Paused`
			} else if (dataObj.gameStatus == 'gameOver') {
				document.querySelector('.match__tablo-heading').innerHTML = `Game over`
			}

			console.log('Data from server updated')
		})
}

function updateButtons(bArr) {
	// arry of show buttons

	// set all buttons to hidden
	const showBtns = {
		newgame: false,
		pause: false,
		resume: false,
		stop: false,
	}
	// set all not hidden buttons
	bArr.forEach((b) => {
		showBtns[b] = true
	})

	// set classes to buttons
	for (let key in showBtns) {
		const mySelector = key
		const myClass = `#btn-${mySelector}`
		let el = document.querySelector(myClass)
		el.className = showBtns[key] ? 'btn' : 'btn--hidden'
	}
}

// send POST method to server
function serverPOST(actionObj) {
	fetch('http://localhost:3000/', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(actionObj),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log('Success:', data)
		})
		.catch((error) => {
			console.error('Error:', error)
		})
}

function startWebUpdating() {
	// check if already an interval has been set up
	if (!nIntervId) {
		nIntervId = setInterval(updateWebsite, 1000)
	}
}

function stopWebUpdating() {
	clearInterval(nIntervId)
	// release our intervalID from the variable
	nIntervId = null
}

function startGame() {
	console.log('New game button activated')
	updateButtons(['pause', 'stop'])
	serverPOST({
		action: 'newGame',
	})
	updateWebsite()
	startWebUpdating()
}

function pauseGame() {
	updateButtons(['resume', 'stop'])
	serverPOST({
		action: 'pause',
	})
	stopWebUpdating()
	updateWebsite()
}

function resumeGame() {
	updateButtons(['pause', 'stop'])
	serverPOST({
		action: 'resume',
	})
	updateWebsite()
	startWebUpdating()
}

function stopGame() {
	updateButtons(['newgame'])
	serverPOST({
		action: 'stop',
	})
	updateWebsite()
	stopWebUpdating()
}


// -------------------------------- GAME LOGIC --------------------------------
// variable to store our intervalID
let nIntervId
initGame()
