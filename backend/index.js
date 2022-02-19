import express from 'express'
import cors from 'cors'
import Basketball from './basketball.js'

const app = express();
const PORT = 3000;
app.use(cors()) // we use cors for web browser restrictions
app.use('/logos', express.static('./src/logos'))
app.use(express.json()) // automatinis stringo konvertavimas

// set default match data
const defMatchData = {
	round: 23,
	date: getDate(),
	stadium: 'Peace And Friendship Stadium',
	time: getTime(),
	team1Name: 'Žalgiris',
	team1LogoUrl: 'http://localhost:3000/logos/zalgiris.png',
	team2Name: 'Olympiacos Piraeus',
	team2LogoUrl: 'http://localhost:3000/logos/olympiacos-piraeus-logo.jpg',
	totalTime: 0, // total match time
	quarterTime: 6000, // there are 4 quarters by 10 minutes
	attackTimeMin: 130, // time in misiseconds witch team use to attack
	attackTimeMax: 230,
	team1Score: 0,
	team2Score: 0,
	attackingTeam1: null, // random defines in Basketball.js class
	quarter: 1,
	gameStatus: 'init', // could be: 'init', 'running', 'paused', 'gameOver'
}

const match = new Basketball(defMatchData)

// routers
app.get('/',(req,res)=>{
	res.json(match.par)
})

app.post('/',(req,res)=>{
	const reqObject = req.body // get object from frontend
	if (reqObject.action == "newGame") {
		match.init()
		match.start()
	} else if (reqObject.action == "pause") {
		match.pause()
	} else if (reqObject.action == "resume") {
		match.start()
	} else if (reqObject.action == "stop") {
		match.stop()
	}
	res.json(match)
})

// -------------------------------- FUNCTIONS --------------------------------
function getDate() {
	const timeElapsed = Date.now()
	const today = new Date(timeElapsed)
	return today.toDateString().slice(4)
}

function getTime() {
	const d = new Date()
	const mins = ('0' + d.getMinutes()).slice(-2)
	return d.getHours() + ':' + mins
}

app.listen(PORT ,()=>console.log(`Connected to ${PORT}`))