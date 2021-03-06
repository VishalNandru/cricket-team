const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
app.use(express.json());

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET Cricket list
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *
    FROM cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//Add a Player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postPlayerQuery = `
        INSERT INTO 
        cricket_team(player_name,jersey_number,role)
        VALUES(
            '${playerName}',
            '${jerseyNumber}',
            '${role}');`;
  await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

//Get a player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT *
    FROM cricket_team
    WHERE 
    player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//Update a player
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putPlayerQuery = `
    UPDATE cricket_team
    SET
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE player_id = ${playerId};`;
  await db.run(putPlayerQuery);
  response.send("Player Details Updated");
});

//Delete a player

app.delete("/players/:playerId/", async (response, request) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
