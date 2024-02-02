const express = require('express')
const app = express()

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000')
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//Get players API
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT * FROM cricket_team ORDER BY player_id;
  `
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//Post Players API
app.post('/players/', async (request, response) => {
  const teamDetails = request.body
  const {playerId, playerName, jerseyNumber, role} = teamDetails
  const addPlayerQuery = `
    INSERT INTO
       cricket_team(player_id, player_name, jersey_number, role)
    VALUES 
      (${playerId},
       ${playerName},
       ${jerseyNumber},
       ${role}
      );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})
