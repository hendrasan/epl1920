const Promise = require('bluebird');
const fs = require('fs');

fs.readFile('epl1920stat.json', 'utf-8', handleFile);

function handleFile(err, data) {
  if (err) throw err;

  players = JSON.parse(data);
  let stats = [
    "appearances",
    "height",
    "weight",
    "saves",
    "goalsConceded",
    "cleanSheets",
    "goals",
    "assists",
    "tackles",
    "shots",
    "keyPasses"
  ]
  for (let stat of stats) {
    console.log("Top 20 " + stat);
    console.log("=========");

    let a = players.filter(function(player) {
      return player[stat] > 0;
    })
    .sort(function (a, b) {
      return b[stat] - a[stat];
    })
    .slice(0, 20)
    .map(function(player, index) {
      // return `${player.name}: ${player[stat]}`;
      return {
        rank: index + 1,
        name: player.name,
        [stat]: player[stat]
      };
    });

    // for (s of a) {
    //   console.log(s.name + ' = ' + s[stat]);
    // }

    console.table(a);
  }

  // let topHeight = players.filter(function(player) {
  //   return player.height > 0;
  // })
  // .sort(function (a, b) {
  //   return b.height - a.height;
  // })
  // .slice(0, 20)
  // .map(function (player) {
  //   return {
  //     name: player.name,
  //     height: player.height
  //   };
  // });
  // console.log(topHeight);

  // console.log(players);
  // let topKeyPasses = players.sort(function(a, b) {
  //   return b.tackles - a.tackles;
  // })
  // .slice(0, 20)
  // .map(function({name, tackles}) {
  //   return {
  //     name,
  //     tackles
  //   };
  // });

  // console.log(topKeyPasses);
}
