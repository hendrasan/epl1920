const fs = require('fs');
const axios = require('axios');

const teams = ["1", "2", "127", "131", "43", "4", "6", "7", "26", "10", "11", "12", "23", "14", "18", "20", "21", "33", "25", "38"];

let players = [];
let promises = [];

axios.defaults.headers.common = {
  "Origin": "https://www.premierleague.com"
};

for (let id of teams) {
  let url = `https://footballapi.pulselive.com/football/teams/${id}/compseasons/274/staff?pageSize=30&compSeasons=274&altIds=true&page=0&type=player`;

  promises.push(axios.get(url));
}

axios.all(promises).then(function (results) {
  results.forEach(function (response) {
    response.data.players.map(function (player) {
      let id = player.playerId;
      let team = response.data.team.name;
      let optaId = player.altIds.opta;
      let firstName = player.name.first;
      let lastName = player.name.last;
      let name = player.name.display;
      let position = player.info.position;
      let number = player.info.shirtNum;
      let appearances = player.appearances;
      let height = player.height || 0;
      let weight = player.weight || 0;
      let saves = position == "G" ? player.saves : 0;
      let goalsConceded = position == "G" ? player.goalsConceded : 0;
      let cleanSheets = player.cleanSheets || 0;
      let goals = player.goals || 0;
      let assists = player.assists || 0;
      let tackles = player.tackles || 0;
      let shots = player.shots || 0;
      let keyPasses = player.keyPasses || 0;
      let picture = `https://premierleague-static-files.s3.amazonaws.com/premierleague/photos/players/250x250/${optaId}.png`;

      players.push({
        id,
        team,
        optaId,
        firstName,
        lastName,
        name,
        position,
        number,
        picture,
        appearances,
        height,
        weight,
        saves,
        goalsConceded,
        cleanSheets,
        goals,
        assists,
        tackles,
        shots,
        keyPasses
      });
    });
  });

  let json = JSON.stringify(players);

  fs.writeFile('epl1920stat.json', json, 'utf-8', function (e) {
    console.log(e);
  });
});